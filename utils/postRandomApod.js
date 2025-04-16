require("dotenv").config()
const {
	getApodOfToday,
	isDatePosted,
	getApod,
	markDateAsPosted,
} = require("../services/mongo")
const { postImage } = require("../instagram")
const fetch = (...args) =>
	import("node-fetch").then((mod) => mod.default(...args))
const fs = require("fs")
const path = require("path")
const { postPhoto } = require("./postApod")

async function getRandomDate() {
	const start = new Date(1995, 5, 16)
	const end = await getApodOfToday().then((apod) => {
		const dateParts = apod.date.split("-") // Split the date string (YYYY-MM-DD)
		return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]) // Return a Date object
	})

	while (true) {
		const randomDate = new Date(
			start.getTime() + Math.random() * (end.getTime() - start.getTime())
		) // Generate a random date between start and end
		const formattedDate = randomDate.toISOString().split("T")[0] // Format as YYYY-MM-DD

		const alreadyPosted = await isDatePosted(formattedDate)
		if (!alreadyPosted) {
			return formattedDate // Return the formatted date directly
		}
	}
}

async function postRandomApod() {
	let apod
	while (true) {
		date = await getRandomDate()
		console.log("Random date:", date)

		apod = await getApod(date)

		if (apod.media_type !== "image") {
			console.log("APOD is not an image. Trying again...")
			continue
		}
		console.log("APOD:", apod)
		break
	}
	postPhoto(apod)
}

module.exports = { postRandomApod }
