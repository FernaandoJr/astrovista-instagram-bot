require("dotenv").config()
const { postImage } = require("../instagram")
const fetch = (...args) =>
	import("node-fetch").then((mod) => mod.default(...args))
const fs = require("fs")
const path = require("path")
const sharp = require("sharp")
const { markDateAsPosted } = require("../services/mongo")

async function downloadImage(url, filename) {
	// Check if the file extension is valid
	const validExtensions = [".jpg", ".jpeg", ".png"]
	const fileExtension = path.extname(url).toLowerCase()

	console.log("File extension:", fileExtension)

	if (!validExtensions.includes(fileExtension)) {
		throw new Error(
			`Invalid image format: ${fileExtension}. Supported formats are ${validExtensions.join(
				", "
			)}`
		)
	}

	const res = await fetch(url)
	const buffer = await res.buffer()

	console.log("Image downloaded and resized:", filename)

	// Convert to JPEG
	const fullPath = path.join(
		__dirname,
		"../images",
		filename.replace(".png", ".jpg")
	)

	await sharp(buffer)
		.resize(1080, 1080, { fit: "inside" }) // Maintain aspect ratio
		.jpeg({ quality: 90 })
		.toFile(fullPath)

	console.log("Image resized and saved:", fullPath)

	return fullPath
}

async function postPhoto(apod) {
	console.log("Posting APOD...")
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
	const cleanExplanation = apod.explanation.replace(/\n/g, " ")

	const cleanCopyright = apod.copyright
		? apod.copyright.replace(/\n/g, " ").replace(/�/g, "")
		: ""

	// Improved Instagram-like caption in English
	let caption = `🪐 ${apod.title} 🌌\n\n`
	caption += `📅 Date: ${formattedDate}\n\n`
	caption += `📸 Explanation: ${cleanExplanation}\n\n`
	caption = caption.slice(0, 2000) // Instagram caption limit
	if (caption.length > 2000) caption = caption.slice(0, 100) + "..."
	if (cleanCopyright) caption += `📸 Credit: ${cleanCopyright}\n\n`
	caption += `Follow @astrovista.app for more amazing space content! Or visit our website, link in bio 🔗\n\n`

	caption += `#Astronomy #NASA #Astrophotography #Space #APOD #AstronomyPictureOfTheDay #Cosmos #Universe #Science #Nature #Stargazing #AstroPhotography #NASAAPOD #SpaceLovers #ExploreTheUniverse #AstroArt #AstronomyLovers #Astrophysics #CosmicWonder #CelestialBeauty #StellarWonders #GalacticJourney #AstronomyCommunity #SpaceExploration #AstroInspiration`

	await postImage(imagePath, caption)
	console.log("Image successfully posted.")

	markDateAsPosted(apod.date)
	console.log("Date marked as posted:", apod.date)
}

module.exports = { postPhoto }
