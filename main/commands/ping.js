const { SlashCommandBuilder,Interaction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replis with server uptime'),
        /**
         * 
         * @param {Interaction} interaction 
         */
	async execute(interaction) {
		await interaction.reply(`Server has been up for ${process.uptime()} seconds`);
	},
};
