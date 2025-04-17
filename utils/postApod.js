require("dotenv").config()
const { postImage } = require("../instagram")
const { downloadImage } = require("./downloadImage")
const { markDateAsPosted } = require("../services/mongo")
const { logMessage } = require("./logMessage")

async function postPhoto(apod) {
	logMessage(`Posting APOD...`, "INFO")
	const imageUrl = apod.hdurl || apod.url
	const filename = `${apod.date}.jpg`
	const imagePath = await downloadImage(imageUrl, filename)

	// Format the date to include the month name, treating it as a local date
	const dateParts = apod.date.split("-") // Split the date string (YYYY-MM-DD)
	const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]) // Create a local date
	const formattedDate = dateObj.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})

	// Remove all \n characters from explanation and copyright
	const cleanExplanation = apod.explanation
		.replace(/\n/g, " ")
		.replace(/�/g, "")
	const cleanCopyright = apod.copyright
		? apod.copyright.replace(/\n/g, " ").replace(/�/g, "")
		: ""

	// Improved Instagram-like caption in English
	let caption = `🪐 ${apod.title} ✨\n\n`
	caption += `📅 Date: ${formattedDate}\n\n`
	caption += `📸 Explanation: ${cleanExplanation}\n\n`
	caption = caption.slice(0, 2000) // Instagram caption limit
	if (caption.length > 2000) caption = caption.slice(0, 100) + "..."
	if (cleanCopyright) caption += `📸 Credit: ${cleanCopyright}\n\n`
	caption += `Follow @astrovista.app for more amazing space content! Or visit our website, link in bio 🔗\n\n`

	caption += `#Astronomy #NASA #Astrophotography #Space #APOD #AstronomyPictureOfTheDay #Cosmos #Universe #Science #Nature #Stargazing #AstroPhotography #NASAAPOD #SpaceLovers #ExploreTheUniverse #AstroArt #AstronomyLovers #Astrophysics #CosmicWonder #CelestialBeauty #StellarWonders #GalacticJourney #AstronomyCommunity #SpaceExploration #AstroInspiration #AstroVista #AstroVistaApp #AstroVistaCommunity`

	await postImage(imagePath, caption)
	logMessage(`Image posted successfully!`, "SUCCESS")

	markDateAsPosted(apod.date)
	logMessage(`Date marked as posted: ${apod.date}`, "SUCCESS")
}

module.exports = { postPhoto }
