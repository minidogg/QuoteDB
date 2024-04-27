const { SlashCommandBuilder,Interaction } = require('discord.js');
const lazyEmbed = require("../lazyEmbed.js")
const db = require("../db.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quotes')
		.setDescription('Replies with last 20 quotes.'),
        /**
         * 
         * @param {Interaction} interaction 
         */
	async execute(interaction) {

        await interaction.reply({embeds:[lazyEmbed({
            "title":"Quotes",
            "message":`Last 20 quotes: \n`
        })],ephemeral:interaction.channel.name.includes("quotes")});
	},
};
