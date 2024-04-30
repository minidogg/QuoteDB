const { SlashCommandBuilder,Interaction } = require('discord.js');
const lazyEmbed = require("../lazyEmbed.js")
var os = require('os');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with server uptime'),
        /**
         * 
         * @param {Interaction} interaction 
         */
	async execute(interaction,client,db) {
        await interaction.reply({embeds:[lazyEmbed({
            "title":"Pong! :ping_pong:",
            "message":`Server has been up for ${process.uptime()} seconds.`})],
            ephemeral:!(interaction.channel.name.includes("command")||interaction.channel.name.includes("bot"))});
	},
};