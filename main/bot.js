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

var lastQuoteTime = 0
var regex = /(".+" *- *<@\d+>,? *\d*)/g
client.on("messageCreate",(msg)=>{
    if(!msg.channel.name.includes("quotes"))return
    if(msg.author.bot===true)return
    if(!regex.test(msg.content))return
    msg.reply({ content: "Adding quote to DB...",components:[deleteRow], ephemeral: true });

    try{
        let add = db.add(regex.exec(msg.content),msg.author.username,msg.author.id)
        msg.reply({ content: add,components:[deleteRow], ephemeral: true });
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
