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
        let quotes = db.getQuotes().map(e=>e.quote).join("\n")

        await interaction.reply({embeds:[lazyEmbed({
            "title":"Quotes",
            "message":`Last 20 quotes: \n\n${quotes}}`
        })],ephemeral:interaction.channel.name.includes("quotes")});
	},
};
