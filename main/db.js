const fs = require("fs")
const gg = (id,file="")=>"../db/"+id+"/"+file
const { maxFetch } = require('./config.json');

function getDBmain(){
    return JSON.parse(fs.readFileSync("../db/db.json","utf-8"))
}
function setDBmain(data){
    return fs.writeFileSync("../db/db.json",JSON.stringify(data),"utf-8")
}

function setup(){
    if(!fs.existsSync("../db")){
        fs.mkdirSync("../db")
    }
    if(!fs.existsSync("../db/db.json")){
        fs.writeFileSync("../db/db.json",JSON.stringify({'guilds':[]}),"utf-8")
    }
    // let db = getDBmain()
    // if(typeof(db.guilds)==="undefined"){
    //     db.guilds = []
    //     setDBmain(db)
    // }
}
setup()

var quoteIdRegex = /".+" *- *<@(\d+)>,? *\d*/

var dbShutdown = false
// var dbMain = getDBmain()

// setInterval(()=>{
//     try{
//         setDBmain(dbMain)
//     }catch(err){
//         console.warn(err)
//     }
// },5000)

let dbGuilds = []
function updateDbGuilds(){
    dbGuilds = fs.readdirSync("../db/").filter(e=>!e.endsWith(".json"))
}
module.exports.updateDbGuilds = updateDbGuilds;
updateDbGuilds()

module.exports.createGuild = (id)=>{
    if(!fs.existsSync("../db/"+id)){
        fs.mkdirSync("../db/"+id)
        fs.writeFileSync("../db/"+id+"/db.json",JSON.stringify({files:1}))
        fs.writeFileSync("../db/"+id+"/0.json",JSON.stringify({quotes:[]}))
    }
    // if(!dbMain.guilds.find(e=>e==id)){
    //     dbMain.guilds.push(id)
    // }
}

module.exports.add = (quote, user, userID,guildId) => {
    if(dbShutdown){
        return "DB Shutdown"
    }
    try {
        if (quote.length >= 350) {
            return "Quote can't be bigger than 350 characters!";
        }
        let quoteId = quoteIdRegex.exec(quote)[1]; //this is who the quote was about
        let quoteData = { reporterId: userID, quotedId: quoteId, quote: quote }
        
        let main = JSON.parse(fs.readFileSync(gg(guildId,"db.json"),"utf-8"))
        let i = main.files
        let file = JSON.parse(fs.readFileSync(gg(guildId,(i-1)+".json"),"utf-8"))
        if(file.quotes.length>=Math.max(50,maxFetch)){
            main.files+=1
            i+=1
            file = {"quotes":[]}
            file.quotes.push(quoteData)
            fs.writeFileSync(gg(guildId,"db.json"),JSON.stringify(main),"utf-8")
        }else{
            file.quotes.push(quoteData)
        }
        fs.writeFileSync(gg(guildId,(i-1)+".json"),JSON.stringify(file),"utf-8")

        return "Added quote!";
    } catch (err) {
        console.warn(err);
        return "Something went wrong when adding the quote to the DB!";
    }
};


//return array of quotes
module.exports.getQuotes = function(guildId,count=100,maxChar=3250){
    if(dbShutdown){
        return "DB Shutdown"
    }
    try{
        let quotes = []
        let len = 0
        let main = JSON.parse(fs.readFileSync(gg(guildId,"db.json"),"utf-8"))
        for(let i = main.files;i>0;i--){
            if(quotes.length >= count) break;
            let file = JSON.parse(fs.readFileSync(gg(guildId,(i-1)+".json"),"utf-8"))
            for(let i2 = file.quotes.length;i2>0;i2--){
                if(quotes.length >= count) break;
                if (file.quotes[i2 - 1] && file.quotes[i2 - 1].quote) {
                    if(file.quotes[i2 - 1].quote.length+len>maxChar)break
                    quotes.push(file.quotes[i2 - 1]); 
                    len += file.quotes[i2 - 1].quote.length
                }
            }
        }
        return quotes
    } catch(err){
        console.warn(err)
        return `Something went wrong when retrieving last ${count} quotes!`
    }
}


//get quotes from a user id
module.exports.getQuotesFrom = function(userID,cap=-1,maxChar=3000){
    if(dbShutdown){
        return "DB Shutdown"
    }
    try{
        let quotes = []
        let len = 0
        dbGuilds.forEach((guildId)=>{
            let main = JSON.parse(fs.readFileSync(gg(guildId,"db.json"),"utf-8"))

            for(let i = main.files;i>0;i--){
                if(quotes.length>=cap&&cap>0)break
                let file = JSON.parse(fs.readFileSync(gg(guildId,(i-1)+".json"),"utf-8"))
                for(let i2 = 0;i2<file.quotes.length;i2++){
                    if(quotes.length>=cap&&cap>0)break
                    if(file.quotes[i2].reporterId==userID){
                        if(file.quotes[i2].quote.length+len>maxChar)break
                        quotes.push(file.quotes[i2])
                        len += file.quotes[i2].quote.length
                    }
                }
            }

        })   

        return quotes
    }catch(err){
        console.warn(err)
        return `Something went wrong when retrieving quotes!`
    }
}

//get all quotes of a person
module.exports.getQuotesOf = function(guildId, userID,count=-1,maxChar=3200){
    if(dbShutdown){
        return "DB Shutdown"
    }
    try{
        let quotes = []
        let len = 0
        let main = JSON.parse(fs.readFileSync(gg(guildId,"db.json"),"utf-8"))
        for(let i = main.files;i>0;i--){
            if(quotes.length >= count) break;
            let file = JSON.parse(fs.readFileSync(gg(guildId,(i-1)+".json"),"utf-8"))
            for(let i2 = file.quotes.length;i2>0;i2--){
                if(quotes.length >= count) break;
                if (file.quotes[i2 - 1] && file.quotes[i2 - 1].quote) {
                    if(file.quotes[i2 - 1].quote.length+len>maxChar)break
                    if(file.quotes[i2 - 1].quotedId==userID)continue;
                    quotes.push(file.quotes[i2 - 1]); 
                    len += file.quotes[i2 - 1].quote.length
                }
            }
        }
        return quotes

        // let quotes = []
        // let len = 0
        // dbGuilds.forEach((guildId)=>{
        //     let main = JSON.parse(fs.readFileSync(gg(guildId,"db.json"),"utf-8"))

        //     for(let i = main.files;i>0;i--){
        //         if(quotes.length>=cap&&cap>0)break
        //         let file = JSON.parse(fs.readFileSync(gg(guildId,(i-1)+".json"),"utf-8"))
        //         for(let i2 = file.quotes.length;i2>0;i2--){
        //             if(quotes.length>=cap&&cap>0)break
        //             if(file.quotes[i2-1].quotedId==userID)quotes.push(file.quotes[i2-1])
        //         }
        //     }

        // })   
        // return quotes;
    }catch(err){
        console.log("aaa")
        console.warn(err)
        return `Something went wrong when retrieving quotes!`
    }
}
module.exports.shutdown = ()=>{
    dbShutdown = true
}