require("dotenv").config()
const { postLatestApod } = require("./utils/postLatestApod")
const cron = require("node-cron")
const { postRandomApod } = require("./utils/postRandomApod")

// Cron job to post a random APOD every hour - 0 * * * *
cron.schedule("20 * * * *", async () => {
	console.log("Posting random APOD...")
	await postRandomApod()
})

// Cron job to run the main bot daily at 11 AM - 0 11 * * *
cron.schedule("0 11 * * *", async () => {
	console.log("Posting latest APOD...")
	await postLatestApod()
})

// postRandomApod()
console.log("Bot started.")
