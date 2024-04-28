import { SlashCommandBuilder, Interaction } from 'discord.js';
import lazyEmbed from "../lazyEmbed.js";
import { getQuotes, getQuotesOf } from "../db.js";

export const data = new SlashCommandBuilder()
    .setName('quotes')
    .setDescription('Replies with last 20 quotes.')
    .addSubcommand(subcommand => subcommand
        .setName('user')
        .setDescription('Get quotes from a specific user.')
        .addUserOption(option => option.setName('user').setDescription('The user id/mention').setRequired(true)))
    .addSubcommand(subcommand => subcommand
        .setName('last')
        .setDescription('Gets last 20 quotes')
        /*.addUserOption(option => option.setName('user').setDescription('The user id/menton'))*/ 
    );
export
    /**
     *
     * @param {Interaction} interaction
     */
    async function execute(interaction) {
    switch (interaction.options._subcommand) {
        case ("last"):
            var quotes = getQuotes(interaction.guild.id).map(e => e.quote + ` (<@${e.reporterId}>)`).join("\n");

            await interaction.reply({
                embeds: [lazyEmbed({
                    "title": "Quotes",
                    "message": `Last 20 quotes: \n\n${quotes}`
                })], ephemeral: !(interaction.channel.name.includes("command") || interaction.channel.name.includes("bot"))
            });
            break;
        case ("user"):
            var id = parseFloat(interaction.options._hoistedOptions[0].value);
            if (Number.isNaN(id)) {
                interaction.reply("Invalid user/userID!");
                return;
            }
            var quotes = getQuotesOf(id).map(e => e.quote + ` (<@${e.reporterId}> )`).join("\n");

            await interaction.reply({
                embeds: [lazyEmbed({
                    "title": "Quotes",
                    "message": `Last 20 quotes: \n\n${quotes}`
                })], ephemeral: !(interaction.channel.name.includes("command") || interaction.channel.name.includes("bot"))
            });
            break;
        default:
            interaction.reply("Subcommand doesn't exist?");
            break;
    }

}
