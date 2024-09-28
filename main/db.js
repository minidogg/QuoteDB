const fs = require("fs");
const path = require("path")
const readline = require('readline');

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

// Count New Lines Function
async function CountNewLines(filePath) {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineCount = 0;

    for await (const line of rl) {
        lineCount++;
    }

    return lineCount;
}

async function AddQuote(contents, authorId, reporterId, guildId){
    if(authorId.toString().length>20)return "Invalid user ID"
    console.log(contents, authorId, reporterId, guildId)
    TryAddUser(authorId, guildId+";"+Date.now()+";"+reporterId+";"+contents+";\n")
    let quoteId = await CountNewLines(path.join(usersPath, authorId+".qdb"))
    console.log(quoteId)


    // TODO: Change this to be the bot's emoji id thing.
    return "Success! <:quotedb:1289691354749993082>"
}
module.exports.add = AddQuote;