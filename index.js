require("dotenv").config()
const { postLatestApod } = require("./utils/postLatestApod")
const cron = require("node-cron")
const { postRandomApod } = require("./utils/postRandomApod")

// Helper function to log beautified messages with formatted timestamps
function logMessage(message, type = "INFO") {
	const now = new Date()
	const timestamp = now
		.toISOString()
		.replace("T", " ")
		.split(".")[0]
		.replace(/-/g, "/") // Format: YYYY/MM/DD hh:mm:ss
	const logTypes = {
		INFO: "\x1b[36m[INFO]\x1b[0m", // Cyan
		SUCCESS: "\x1b[32m[SUCCESS]\x1b[0m", // Green
		ERROR: "\x1b[31m[ERROR]\x1b[0m", // Red
	}
	const logType = logTypes[type] || logTypes.INFO
	console.log(`${logType} [${timestamp}] ${message}`)
}

// Cron job to post a random APOD every hour - 0 * * * *
cron.schedule("0 * * * *", async () => {
	logMessage("Starting random APOD post...")
	try {
		await postRandomApod()
		logMessage("Random APOD posted successfully.", "SUCCESS")
	} catch (error) {
		logMessage(`Error posting random APOD: ${error.message}`, "ERROR")
	}
})

// Cron job to run the main bot daily at 11 AM - 0 11 * * *
cron.schedule("0 11 * * *", async () => {
	logMessage("Starting latest APOD post...")
	try {
		await postLatestApod()
		logMessage("Latest APOD posted successfully.", "SUCCESS")
	} catch (error) {
		logMessage(`Error posting latest APOD: ${error.message}`, "ERROR")
	}
})

// Initial log to indicate the bot has started
logMessage("Bot started.", "SUCCESS")

module.exports = { logMessage }
