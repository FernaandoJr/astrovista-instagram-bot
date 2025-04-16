const { MongoClient } = require("mongodb")

async function getApodOfToday() {
	const client = new MongoClient(process.env.MONGO_URI)
	await client.connect()
	const db = client.db("Apod")
	const collection = db.collection("pictures")

	const apod = await collection.findOne({}, { sort: { date: -1 } })

	await client.close()
	return apod
}

async function getApod(date) {
	const client = new MongoClient(process.env.MONGO_URI)
	await client.connect()
	const db = client.db("Apod")
	const collection = db.collection("pictures")

	const apod = await collection.findOne({ date: date })

	return apod
}

async function isDatePosted(date) {
	const client = new MongoClient(process.env.MONGO_URI)
	await client.connect()
	const db = client.db("Apod")
	const collection = db.collection("posted_dates")

	const result = await collection.findOne({ date })
	return result !== null
}

async function markDateAsPosted(date) {
	const client = new MongoClient(process.env.MONGO_URI)
	await client.connect()
	const db = client.db("Apod")
	const collection = db.collection("posted_dates")

	await collection.insertOne({ date })
}

module.exports = { getApodOfToday, getApod, isDatePosted, markDateAsPosted }
