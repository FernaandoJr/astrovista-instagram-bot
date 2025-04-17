require("dotenv").config()

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

module.exports = { logMessage }
