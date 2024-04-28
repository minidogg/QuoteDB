import { SlashCommandBuilder, Interaction, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

const deleteButton = new ButtonBuilder()
.setCustomId('delete')
.setLabel('Delete')
.setStyle(ButtonStyle.Danger);
const deleteRow = new ActionRowBuilder()
.addComponents(deleteButton);

import lazyEmbed from "../lazyEmbed.js";

export const data = new SlashCommandBuilder()
    .setName('github')
    .setDescription('Replies with github repo link');
export
    /**
     *
     * @param {Interaction} interaction
     */
    async function execute(interaction) {
    await interaction.reply({
        embeds: [lazyEmbed({
            "title": "Github Repo",
            "message": "[Repo](https://github.com/ReallyBadDeveloper/QuoteDB)"
        })], ephemeral: true
    });
}
