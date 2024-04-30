const { SlashCommandBuilder,Interaction,ButtonBuilder,ActionRowBuilder,ButtonStyle } = require('discord.js');

const deleteButton = new ButtonBuilder()
.setCustomId('delete')
.setLabel('Delete')
.setStyle(ButtonStyle.Danger);
const deleteRow = new ActionRowBuilder()
.addComponents(deleteButton);

const lazyEmbed = require("../lazyEmbed.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('github')
		.setDescription('Replies with github repo link'),
        /**
         * 
         * @param {Interaction} interaction 
         */
	async execute(interaction,client,db) {
		await interaction.reply({embeds:[lazyEmbed({
            "title":"Github Repo",
            "message":"[Repo](https://github.com/ReallyBadDeveloper/QuoteDB)",
            "color":"#000000"
        })],ephemeral:interaction.channel.name.includes("command")||interaction.channel.name.includes("bot")});
	},
};