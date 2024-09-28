
process.on('unhandledRejection', (reason, promise) => {
    console.warn(reason);
    console.log('Unhandled Rejection at:', reason.stack || reason);
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
});

const fs = require("fs");
const path = require('path');

// Add config if it doesn't exist already
if (!fs.existsSync("./config.json")) {
    fs.writeFileSync("./config.json", `
{
    "token":"Your bot token",
    "clientId":"The user id of your bot.",
    "host":"username or some identifier. or you can just make this a blank string.",
    "port":"3000",
    "maxFetch":"20"
}
`, "utf-8");
}
let configDatTemp123AbcDefg = JSON.parse(fs.readFileSync("./config.json","utf-8"))
if(!configDatTemp123AbcDefg.maxFetch){
    configDatTemp123AbcDefg.maxFetch = 100
    fs.writeFileSync("./config.json",JSON.stringify(configDatTemp123AbcDefg,null,"  "),"utf-8")
}

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, ButtonBuilder, ActionRowBuilder, ButtonStyle, REST, Routes } = require('discord.js');
const { token, clientId } = require('./config.json');
const { maxFetch } = require('./config.json');
const config = require("./config.json");
const added = typeof (config.host) === "string" && config.host !== " " ? ` (Being hosted by ${config.host})` : "";
const express = require("./express/index.js");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const db = require("./db.js");
const { error } = require("console");

// The actual MEAT of the bot
const deleteButton = new ButtonBuilder()
    .setCustomId('delete')
    .setLabel('Delete Message')
    .setStyle(ButtonStyle.Danger);
const deleteRow = new ActionRowBuilder()
    .addComponents(deleteButton);

client.on("interactionCreate", (i) => {
    try {
        if (config.guilds && !config.guilds.includes(i.guildId)) {
            return;
        }
        if (i.isButton() == false) return;
        if (i.component.customId != "delete") return;
        i.message.delete();


    } catch (err) {
        console.warn(err);
        i.reply("Something went wrong");
    }
});

var nextQuoteTime = 0;
client.on("messageCreate", async (msg) => {
    if (config.guilds && !config.guilds.includes(msg.guildId)) {
        return;
    }
    if (msg.author.bot === true) return;
    if (msg.content !== `<@${clientId}>` && msg.content !== "<@949479338275913799>") return;
    try {
        if (Date.now() <= nextQuoteTime) {
            await msg.reply({ content: `Please wait ${(nextQuoteTime - Date.now()) / 1000} more seconds before making another quote!`, components: [deleteRow] });
            return;
        }
        // await msg.reply({ content: "Adding quote to DB...", components: [deleteRow] });

        let repliedTo;
        try {
            repliedTo = await msg.channel.messages.fetch(msg.reference.messageId);
        } catch (err) {
            console.warn(err);
            await msg.reply({ content: "You must reply to a message to quote it!", components: [deleteRow], ephemeral: true });
            return;
        }

        let content = `"${repliedTo.content}" - <@${repliedTo.author.id}> ${new Date().getFullYear()}`;
        let add = db.add(content, clientId, msg.guild.id);
        await msg.reply({ content: add, components: [deleteRow], ephemeral: true });
        await msg.react("✅");
        nextQuoteTime = Date.now() + 5000;
        msg.guild.channels.cache.find((e) => e.name.includes("quotes")).send(content.replaceAll("@everyone","@‍everyone").replaceAll("@here","@‍here"));
    } catch (err) {
        console.warn(err);
        msg.reply("something went wrong");
    }
});

var regex = /"(.+)" *- *<@\d+>,? *\d*/;
client.on("messageCreate", async (msg) => {
    try {
        if (config.guilds && !config.guilds.includes(msg.guildId) && !config.whitelist) {
            return;
        }

        if (!msg.channel.name.includes("quotes")) return;
        if (msg.author.bot === true) return;
        if (!regex.test(msg.content)) return;
        if (Date.now() <= nextQuoteTime) {
            await msg.reply({ content: `Please wait ${(nextQuoteTime - Date.now()) / 1000} more seconds before sending another quote!`, components: [deleteRow] });
            return;
        }

        msg.reply({ content: "Adding quote to DB...", components: [deleteRow] });
        console.log("New Quote ", msg.content)

    } catch (err) {
        console.warn(err);
        await msg.reply("Something went wrong");
    }
    try {
        let add = db.add(regex.exec(msg.content)[1], msg.author.id, msg.guild.id);

        await msg.reply({ content: add, components: [deleteRow] });
        await msg.react("✅");
        nextQuoteTime = Date.now() + 5000;
    } catch (err) {
        console.warn(err);
        await msg.reply("Something went wrong when adding quote to DB!");
    }


});

// Command interaction handler
client.on("interactionCreate", async (i) => {
    try {

        if (config.guilds && !config.guilds.includes(i.guildId)) {
            return;
        }
        if (i.isCommand() !== true) return;
        await commands[i.commandName].execute(i, client,db);

    } catch (err) {
        console.warn(err);
        i.reply("Something went wrong");
    }
});


// Commands
var commands = {};
var jsRegex = /^.*\.js$/;
fs.readdirSync("./commands").forEach((file) => {
    if (!jsRegex.test(file)) return;
    let rq = require(path.resolve("./commands/" + file));
    commands[rq.data.name] = rq;
});
var commands2 = Object.values(commands).map(e => e.data.toJSON());



// Log in the bot
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const refreshCommandI = async ({ e, i, len }) => {
    return new Promise(async (r) => {
        let guildId = e.id;
        console.log(`Refreshing commands for guild: ${guildId} (${e.name}) (${i}/${len})`);
        const rest = new REST().setToken(token);
        await (async () => {
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
        console.log(`Done refreshing commands for guild: ${guildId} (${e.name}) (${i}/${len})`);
        r();
    });

};
const refreshCommands = async () => {

    return new Promise(async (r) => {
        client.guilds.fetch().then(async (guildData) => {
            let len = guildData.size;

            console.log(`Starting to refresh commands for ${len} guilds`);
            let i = 0;
            guildData.forEach(async (e) => {
                i++;
                await refreshCommandI({ e, i, len });

            });

            console.log(`Done refreshing commands for ${len} guilds.`);

            r();
        });
    });


};
async function refreshGuilds() {
    return new Promise(async (r) => {
        client.guilds.fetch().then(async (guildData) => {
            let len = guildData.size;
            console.log(`Starting to refresh DB folder for ${len} guilds`);
            let i = 0;
            guildData.forEach(async (e) => {
                i++;
                let guildId = e.id;
                console.log(`Refreshing folder for guild: ${guildId} (${e.name}) (${i}/${len})`);
                db.createGuild(e.id);
                console.log(`Done refreshing folder for guild: ${guildId} (${e.name}) (${i}/${len})`);

            });

            console.log(`Done refreshing DB folder for ${len} guilds.`);
            r();
        });
    });
}
async function sendStatus() {
    if (clientId !== "1233861877365346334") return;
    let channel = (await client.channels.fetch('1234190000653074603'));
    await channel.send("# Server is up! " + added);
}

client.on("guildCreate", (e) => {
    refreshCommandI({ e, i: 1, len: 1 });
    db.createGuild(e.id);
});



client.login(token).then(async () => {
    await refreshCommands();
    await refreshGuilds();
    sendStatus();

    // express()//runs ./express/index.js
});
