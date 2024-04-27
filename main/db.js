const fs = require("fs")
function setup(){
    if(!fs.existsSync("../db")){
        fs.mkdirSync("../db")
    }
    if(!fs.existsSync("../db/db.txt")){
        fs.writeFileSync("../db/db.txt","","utf-8")
    }
}
module.exports.setup = setup

module.exports.add = (quote,user,userID)=>{


    return "Added quote!"
}