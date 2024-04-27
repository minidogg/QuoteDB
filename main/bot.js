// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });
const db = require("./db.js")

//the actual MEAT of the bot
var lastQuote = 0
var regex = /(".+" *- *<@\d+>,? *\d*)/g
client.on("messageCreate",(msg)=>{
    if(!msg.channel.name.includes("quotes"))return
    if(msg.author.bot===true)return
    if(!regex.test(msg.content))return
    msg.reply("Adding quote to DB...")
    try{
        msg.reply(db.add(regex.exec(msg.content),msg.author.username,msg.author.id))
    }catch(err){
        console.warn(err)
        msg.reply("Something went wrong!")
    }
})




//log in the bot
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
