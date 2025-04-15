require("dotenv").config()
const { getApodOfToday } = require("./mongo")
const { postImage } = require("./instagram")
const fetch = (...args) =>
	import("node-fetch").then((mod) => mod.default(...args))
const fs = require("fs")
const path = require("path")
const cron = require("node-cron")

async function downloadImage(url, filename) {
	const res = await fetch(url)
	const buffer = await res.buffer()
	const fullPath = path.join(__dirname, "images", filename)
	fs.writeFileSync(fullPath, buffer)
	return fullPath
}

async function runBot() {
	const apod = await getApodOfToday()
	if (!apod) {
		console.log("Nenhum APOD encontrado para hoje.")
		return
	}

	if (apod.media_type !== "image") {
		console.log("O APOD de hoje não é uma imagem.")
		return
	}

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

	// Improved Instagram-like caption in English
	let caption = `🪐 ${apod.title} 🌌\n\n`
	caption += `📅 Date: ${formattedDate}\n\n`
	caption += `📸 Explanation: ${apod.explanation}\n\n`
	caption = caption.slice(0, 2000) // Instagram caption limit
	if (caption.length > 2000) caption = caption.slice(0, 100) + "..."
	if (apod.copyright) caption += `📸 Credit: ${apod.copyright}\n\n`
	caption += `Follow @astrovista.app for more amazing space content!\n\n`

	caption += `#Astronomy #NASA #Astrophotography #Space #APOD #AstronomyPictureOfTheDay #Cosmos #Universe #Science #Nature #Stargazing #AstroPhotography #NASAAPOD #SpaceLovers #ExploreTheUniverse #AstroArt #AstronomyLovers #Astrophysics #CosmicWonder #CelestialBeauty #StellarWonders #GalacticJourney #AstronomyCommunity #SpaceExploration #AstroInspiration`

	await postImage(imagePath, caption)
	console.log("Image successfully posted.")
}

// Agendar para 08:00 todos os dias
cron.schedule("0 8 * * *", () => {
	runBot()
})

console.log("Bot iniciado e agendado para 08:00 diariamente.")

module.exports = { runBot }
