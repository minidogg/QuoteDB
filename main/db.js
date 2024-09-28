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
function TryAddUser(userId, content = ""){
    fs.appendFileSync(path.join(usersPath, userId+".qdb"), content)
}
TryAddUser("0")

// Try add guild function to make sure a guild exists
function TryAddGuild(guildId, content = ""){
    fs.appendFileSync(path.join(guildsPath, guildId+".qdb"), content)
}
module.exports.createGuild = TryAddGuild
TryAddGuild("0")

// db.add(regex.exec(msg.content)[1], msg.author.id, msg.guild.id);
function AddQuote(contents, authorId, reporterId, guildId){
    if(authorId.toString().length>20)return "Invalid user ID"
    console.log(contents, authorId, reporterId, guildId)
    TryAddUser(authorId, guildId+";"+Date.now()+";"+reporterId+";"+contents+";")

    // TODO: Change this to be the bot's emoji id thing.
    return "Success! <:quotedb:1289691354749993082>"
}
module.exports.add = AddQuote;