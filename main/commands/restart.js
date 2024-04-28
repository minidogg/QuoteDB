const { SlashCommandBuilder,Interaction } = require('discord.js');
const lazyEmbed = require("../lazyEmbed.js")
var os = require('os');
var devs = ["880898058483814430","906283767734362144","1170452569848549429"]
var cmd=require('node-cmd');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Fetches github repo and then restarts.'),
        /**
         * 
         * @param {Interaction} interaction 
         */
	async execute(interaction,client) {
        if(!devs.includes(interaction.member.id)){
            interaction.reply("No perms haha")
            return
        }
        if(interaction.guild.id!=="1234184478335828012"){
            interaction.reply("Please run this in the QuoteDB server!")
            return
        }
        let data = cmd.runSync("git pull")
        await interaction.reply(data.data+"\n\n (Resarting. This may take some time...)")
        console.log("Restarting...")
        client.channels.fetch('1234190000653074603')
            .then(channel => channel.send("# Restarting server"));
        process.exit();
	},
};