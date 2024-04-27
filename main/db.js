const fs = require("fs")
function setup(){
    if(!fs.existsSync("../db")){
        fs.mkdirSync("../db")
    }
    if(!fs.existsSync("../db/db.json")){
        fs.writeFileSync("../db/db.json","{}","utf-8")
    }
}
module.exports.setup = setup

var quoteIdRegex = /".+" *- *<@(\d+)>,? *\d*/
module.exports.add = (quote,user,userID)=>{
    let quoteId = quoteIdRegex.exec(quote)[1] //this is who the quote was about
    return "Added quote!"
}

//return array of quotes
module.exports.getQuotes = function(count=20){

    return ["test"]
}

//get quotes from a user id
module.exports.getQuotesFrom = function(userID){

    return ["test 123"]
}

//get all quotes of a person
module.exports.getQuotesOf = function(userID){

    return ["test 12345"]
}