import { SlashCommandBuilder, Interaction } from 'discord.js';
import lazyEmbed from "../lazyEmbed.js";
import os from 'os';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with server uptime');
export
    /**
     *
     * @param {Interaction} interaction
     */
    async function execute(interaction) {
    await interaction.reply({
        embeds: [lazyEmbed({
            "title": "Ping",
            "message": `Server has been up for ${process.uptime()} seconds.`
        })],
        ephemeral: !(interaction.channel.name.includes("command") || interaction.channel.name.includes("bot"))
    });
}
