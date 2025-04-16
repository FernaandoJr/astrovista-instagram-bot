require("dotenv").config()
const { getApodOfToday, isDatePosted } = require("../services/mongo")
const fetch = (...args) =>
	import("node-fetch").then((mod) => mod.default(...args))
const { postPhoto } = require("../utils/postApod")

async function postLatestApod() {
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

module.exports = { postLatestApod }
