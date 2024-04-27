const { SlashCommandBuilder,Interaction } = require('discord.js');
const lazyEmbed = require("../lazyEmbed.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with server uptime'),
        /**
         * 
         * @param {Interaction} interaction 
         */
	async execute(interaction) {
        await interaction.reply({embeds:[lazyEmbed({
            "title":"Ping",
            "message":`Server has been up for ${process.uptime()} seconds`
        })],ephemeral:true});
	},
};
