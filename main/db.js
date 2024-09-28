const fs = require("fs");
const path = require("path")

// Utility function for making directories if they don't already exist
function TryMakeDir(dirPath){
    if(!fs.existsSync(dirPath))fs.mkdirSync(dirPath)
}

// Setup the folder structure
const dbPath = path.resolve("../db")
TryMakeDir(dbPath)
const usersPath = path.join(dbPath, "users")
TryMakeDir(usersPath)
const guildsPath = path.join(dbPath, "guilds")
TryMakeDir(guildsPath)

// Try add user function to make sure a user exists
function TryAddUser(userId){
    fs.appendFileSync(path.join(usersPath, userId+".txt"), "")
}
TryAddUser("0")

// Try add guild function to make sure a guild exists
function TryAddGuild(guildId){
    fs.appendFileSync(path.join(guildsPath, guildId+".txt"), "")
}
TryAddUser("0")