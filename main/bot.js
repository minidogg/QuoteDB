const fs = require("fs")
const path = require('path')

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits,ButtonBuilder,ActionRowBuilder,ButtonStyle, REST, Routes } = require('discord.js');
const { token,clientId } = require('./config.json');

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
        let add = db.add(regex.exec(msg.content)[1],msg.author.username,msg.author.id)

        msg.reply({ content: add,components:[deleteRow]});
        msg.react("✅")
        nextQuoteTime = Date.now()+5000
    }catch(err){
        console.warn(err)
        msg.reply("Something went wrong when adding quote to DB!")
    }
})


//command interaction handler
client.on("interactionCreate",async(i)=>{
    if(i.isCommand()!==true)return
    await commands[i.commandName].execute(i)
})


//commands
var commands = {}
fs.readdirSync("./commands").forEach((file)=>{
    let rq = require(path.resolve("./commands/"+file))
    commands[rq.data.name] = rq
})
var commands2 = Object.values(commands).map(e=>e.data.toJSON())



//log in the bot
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token).then(()=>{

    client.guilds.fetch().then((guildData)=>{
        let len = guildData.size
        console.log(`Starting to refresh commands for ${len} guilds`)
        let i = 0
        guildData.forEach((e)=>{
            i++
            let guildId = e.id
            console.log(`Refreshing commands for guild id: ${guildId} (${i}/${len})`)
            const rest = new REST().setToken(token);
            (async () => {
                try {
                    console.log(`Started refreshing ${commands2.length} application (/) commands.`);
            
                    // The put method is used to fully refresh all commands in the guild with the current set
                    const data = await rest.put(
                        Routes.applicationGuildCommands(clientId, guildId),
                        { body: commands2 },
                    );
            
                    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
                } catch (error) {
                    // And of course, make sure you catch and log any errors!
                    console.error(error);
                }
            })();
            console.log(`Done refreshing commands for guild id: ${guildId} (${i}/${len})`)

        })

        
    })

})