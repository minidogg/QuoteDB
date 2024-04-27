// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });


//the actual MEAT of the bot
client.on("messageCreate",(msg)=>{
    if(!msg.channel.name.includes("quotes"))return
    if(msg.author.bot===true)return
    if(!/".+" *- *<@\d+>,? *\d*/g.test(msg.content))return
    msg.reply("Adding quote to DB...")
})




//log in the bot
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
