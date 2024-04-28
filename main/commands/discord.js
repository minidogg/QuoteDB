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
                .setName('discord')
                .setDescription('replies with discord invite'),
        /**
         * 
         * @param {Interaction} interaction 
         */
        async execute(interaction) {
                await interaction.reply({embeds:[lazyEmbed({
            "title":"Discord",
            "message":"[Discord](https://disboard.org/server/1234184478335828012)","color":"#FF00FF"
        })],ephemeral:interaction.channel.name.includes("command")||interaction.channel.name.includes("bot")});
        },
};