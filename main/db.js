const fs = require("fs");
const path = require("path")

// Utility function for making directories if they don't already exist
function tryMakeDir(dirPath){
    if(!fs.existsSync(dirPath))fs.mkdirSync(dirPath)
}

// Setup the folder structure
const dbPath = path.resolve("../db")
tryMakeDir(dbPath)
const usersPath = path.join(dbPath, "users")
tryMakeDir(usersPath)
const guildsPath = path.join(dbPath, "guilds")
tryMakeDir(guildsPath)
