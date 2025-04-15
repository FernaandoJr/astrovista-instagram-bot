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

module.exports = { getApodOfToday }
