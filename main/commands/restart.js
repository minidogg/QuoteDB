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
	async execute(interaction) {
        if(!devs.includes(interaction.member.id)){
            interaction.reply("No perms haha")
            return
        }
        let data = cmd.runSync("git pull")
        await interaction.reply(data.data+(data.data.includes("Already up to date.")?"":" (Restarting. This may take some time...)"))
        if(data.data.includes("Already up to date."))return
        console.log("Restarting...")
        process.exit();
	},
};