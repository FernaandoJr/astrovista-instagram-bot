const { IgApiClient } = require("instagram-private-api")
const fs = require("fs")
const path = require("path")
const { log } = require("console")

async function login() {
	const ig = new IgApiClient()
	console.log("Logging in to Instagram...")
	ig.state.generateDevice(process.env.IG_USERNAME)
	await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD)
	console.log("Logged in to Instagram")
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
