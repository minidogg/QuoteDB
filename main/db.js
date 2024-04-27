const fs = require("fs")

function getDB(){
    return JSON.parse(fs.readFileSync("../db/db.json","utf-8"))
}
function setDB(data){
    return fs.writeFileSync("../db/db.json",JSON.stringify(data),"utf-8")
}

function setup(){
    if(!fs.existsSync("../db")){
        fs.mkdirSync("../db")
    }
    if(!fs.existsSync("../db/db.json")){
        fs.writeFileSync("../db/db.json","{quotes:[]}","utf-8")
    }
    let db = getDB()
    if(typeof(db.quotes)==="undefined"){
        db.quotes = []
        setDB(db)
    }
}
module.exports.setup = setup

var quoteIdRegex = /".+" *- *<@(\d+)>,? *\d*/


module.exports.add = (quote,user,userID)=>{
    try{
        if(quote.length>=350){
            return "Quote can't be bigger than 350 characters!"
        }
        let quoteId = quoteIdRegex.exec(quote)[1] //this is who the quote was about
        let db = getDB()
        db.quotes.unshift({reporterId:userID,quotedId:quoteId,quote:quote})
        setDB(db)
        return "Added quote!"
    }catch(err){
        console.warn(err)
        return "Something went wrong when adding the quote to the DB!"
    }
}

//return array of quotes
module.exports.getQuotes = function(count=20){
    try{
        let db = getDB()
        let quotes = []
        for(let i = 0;i<count;i++){
            quotes.push(db.quotes[i])
        }
        return quotes
    }catch(err){
        console.warn(err)
        return `Something went wrong when retrieving last ${count} quotes!`
    }
}

//get quotes from a user id
module.exports.getQuotesFrom = function(userID){
    try{
        let db = getDB()
        return db.quotes.filter((e)=>e.reporterId==userID)
    }catch(err){
        console.warn(err)
        return `Something went wrong when retrieving last quotes from <@${userID}>!`
    }
}

//get all quotes of a person
module.exports.getQuotesOf = function(userID){
    try{
        let db = getDB()
        return db.quotes.filter((e)=>e.quotedId==userID)
    }catch(err){
        console.warn(err)
        return `Something went wrong when retrieving last quotes of <@${userID}>!`
    }
}