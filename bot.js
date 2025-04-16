require("dotenv").config()
const { getApodOfToday, randomApod, isDatePosted } = require("./mongo")
const { postImage } = require("./instagram")
const fetch = (...args) =>
	import("node-fetch").then((mod) => mod.default(...args))
const fs = require("fs")
const path = require("path")
const cron = require("node-cron")
const { postPhoto } = require("./post-photo")

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

	const alreadyPosted = await isDatePosted(apod.date)
	if (alreadyPosted) {
		console.log("APOD já postado.")
		return
	}

	postPhoto(apod)
}

module.exports = { runBot }
