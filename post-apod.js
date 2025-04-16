require("dotenv").config()
const { runBot } = require("./bot")
const { postPhoto } = require("./post-photo")
const { postRandomApod } = require("./randomApod")

runBot()
postRandomApod()
console.log("Bot started.")
//asd
