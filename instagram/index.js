const { IgApiClient } = require("instagram-private-api")
const fs = require("fs")
const path = require("path")
const { log } = require("console")
const { logMessage } = require("../utils/logMessage")

async function login() {
	const ig = new IgApiClient()
	logMessage("Logging in to Instagram...", "INFO")
	ig.state.generateDevice(process.env.IG_USERNAME)
	await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD)
	logMessage("Logged in to Instagram", "SUCCESS")
	return ig
}

async function postImage(filePath, caption) {
	const ig = await login()
	const imageBuffer = fs.readFileSync(filePath)

	await ig.publish.photo({
		file: imageBuffer,
		caption: caption,
	})
}

module.exports = { postImage }
