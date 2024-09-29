const fs = require("fs");
const path = require("path")
const readline = require('readline');

// Utility function for making directories if they don't already exist
function TryMakeDir(dirPath){
    if(!fs.existsSync(dirPath))fs.mkdirSync(dirPath)
}

// Setup the folder structure
const dbPath = path.resolve("../db2")
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

// Cache variables
let cacheTransactionsInProgress = []
let lineCountCache = {};

// Clear Cache Occasionally
function ClearCacheLoop(){
    if(cacheTransactionsInProgress.length!=0){
        setTimeout(ClearCacheLoop, 5000)
        return;
    }
    lineCountCache = {}
    
    setTimeout(ClearCacheLoop, 60000)
}
ClearCacheLoop()

// Count New Lines Function
async function CountNewLines(filePath, cacheTime=0) {
    cacheTransactionsInProgress.push(true)
    if(typeof(lineCountCache[filePath])!="undefined" && lineCountCache[filePath][1]>Date.now()){
        let count = lineCountCache[0];
        cacheTransactionsInProgress.pop();

        return count;
    }
    cacheTransactionsInProgress.pop();
    console.time("countLines")
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineCount = 0;

    for await (const line of rl) {
        lineCount++;
    }

    if(cacheTime!=0)lineCountCache[filePath] = [lineCount, Date.now(+cacheTime)]
    console.timeEnd("countLines")
    console.log(lineCount)

    return lineCount;
}

async function AddQuote(contents, authorId, reporterId, guildId){
    // Validate the author ID length
    if(authorId.toString().length>20)return "Invalid user ID length"

    // Add the quote
    TryAddUser(authorId, guildId+";"+Date.now()+";"+reporterId+";"+contents+";\n")

    // Get the quote's line id
    let lineId = (await CountNewLines(path.join(usersPath, authorId+".qdb"), 10000))-1

    // Add the quote to the guild.
    TryAddGuild(guildId, authorId+";"+lineId+";\n")

    // TODO: Change this to be the bot's emoji id thing once its made.
    return "Success! <:quotedb:1289691354749993082>"
}
module.exports.add = AddQuote;

async function GetGuildQuotes(guildId, maxFetch){
    const guildIdPath = path.join(guildsPath, guildId+".qdb")
    // let lines = 
}
