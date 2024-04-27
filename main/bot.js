// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits,ButtonBuilder,ActionRowBuilder,ButtonStyle } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });
const db = require("./db.js")
db.setup()

//the actual MEAT of the bot
const deleteButton = new ButtonBuilder()
.setCustomId('delete')
.setLabel('Delete')
.setStyle(ButtonStyle.Danger);
const deleteRow = new ActionRowBuilder()
.addComponents(deleteButton);

client.on("interactionCreate",(i)=>{
    if(i.isButton()==false)return
    if(i.component.customId!="delete")return
    i.message.delete()
})

var nextQuoteTime = 0
var regex = /(".+" *- *<@\d+>,? *\d*)/
client.on("messageCreate",(msg)=>{
    if(!msg.channel.name.includes("quotes"))return
    if(msg.author.bot===true)return
    if(!regex.test(msg.content))return
    if(Date.now()<=nextQuoteTime){
        msg.reply({ content: `Please wait ${(nextQuoteTime-Date.now())/1000} more seconds before sending another quote!`,components:[deleteRow]});
        return
    }
    msg.reply({ content: "Adding quote to DB...",components:[deleteRow]});

    try{
        let add = db.add(regex.exec(msg.content),msg.author.username,msg.author.id)
        msg.reply({ content: add,components:[deleteRow]});
        nextQuoteTime = Date.now()+5000
    }catch(err){
        console.warn(err)
        msg.reply("Something went wrong when adding quote to DB!")
    }
})



//log in the bot
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
