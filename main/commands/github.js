const { SlashCommandBuilder,Interaction,ButtonBuilder,ActionRowBuilder,ButtonStyle } = require('discord.js');

const deleteButton = new ButtonBuilder()
.setCustomId('delete')
.setLabel('Delete')
.setStyle(ButtonStyle.Danger);
const deleteRow = new ActionRowBuilder()
.addComponents(deleteButton);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('github')
		.setDescription('Replies with github repo link'),
        /**
         * 
         * @param {Interaction} interaction 
         */
	async execute(interaction) {
		await interaction.reply({content:`[Repo](https://github.com/ReallyBadDeveloper/QuoteDB)`,ephemeral:true});
	},
};
