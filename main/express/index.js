module.exports = async()=>{
    const path = require("path")
    const db = require("../db.js")
    const express = require('express')
    const app = express()
    const config = require("../config.json")
    const port = typeof(config.port)==='undefined'?3000:config.port
    
    app.use(express.static(path.join(__dirname, 'public')))
    
    app.get('/hello', (req, res) => {
      res.send('Hello World!')
    })
    
    app.listen(port, () => {
      console.log(`Express.js server listening on port ${port}`)
    })
}