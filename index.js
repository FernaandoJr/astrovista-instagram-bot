require("dotenv").config()
const { postLatestApod } = require("./utils/postLatestApod")
const cron = require("node-cron")
const { postRandomApod } = require("./utils/postRandomApod")
const { logMessage } = require("./utils/logMessage")

// Cron job to post a random APOD every hour - 0 * * * *
cron.schedule("0 * * * *", async () => {
	logMessage("Starting random APOD post...", "INFO")
	try {
		await postRandomApod()
		logMessage("Random APOD posted successfully.", "SUCCESS")
	} catch (error) {
		logMessage(`Error posting random APOD: ${error.message}`, "ERROR")
	}
})

// Cron job to run the main bot daily at 11 AM - 0 11 * * *
cron.schedule("0 13 * * *", async () => {
	logMessage("Starting daily APOD post...", "INFO")
	try {
		await postLatestApod()
		logMessage("Latest APOD posted successfully.", "SUCCESS")
	} catch (error) {
		logMessage(`Error posting latest APOD: ${error.message}`, "ERROR")
	}
})
// Initial log to indicate the bot has started
logMessage("Bot started.", "SUCCESS")

// Uncomment the following lines to test the functions directly
// postLatestApod()
// postRandomApod()
