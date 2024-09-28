const { SlashCommandBuilder, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const lazyEmbed = require("../lazyEmbed.js");
const { maxFetch } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quotes')
        .setDescription(`Replies with last ${maxFetch} quotes.`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription(`Gets last ${maxFetch} quotes from a specific user.`)
                .addUserOption(option => option.setName('user').setDescription('The user id/mention').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('last')
                .setDescription(`Gets last ${maxFetch} quotes`)),
    /**
     * 
     * @param {Interaction} interaction 
     */
    async execute(interaction, client, db) {
        try {
            let quotes = [];
            let userSpecified = false;
            let userId;

            switch (interaction.options._subcommand) {
                case ("last"):
                    quotes = db.getQuotes(interaction.guild.id, maxFetch).map(e => e.quote);
                    break;
                case ("user"):
                    userId = parseFloat(interaction.options._hoistedOptions[0].value);
                    if (Number.isNaN(userId)) {
                        interaction.reply("Invalid user/userID!");
                        return;
                    }
                    quotes = db.getQuotesOf(userId, maxFetch).map(e => e.quote);
                    userSpecified = true;
                    break;
                default:
                    interaction.reply("Subcommand doesn't exist?");
                    return;
            }

            if (quotes.length === 0) {
                interaction.reply("No quotes found.");
                return;
            }

            const pageSize = 10; // Number of quotes per page
            const totalPages = Math.ceil(quotes.length / pageSize);

            const generateEmbed = (page) => {
                const start = (page - 1) * pageSize;
                const end = start + pageSize;
                const quotesPage = quotes.slice(start, end).join("\n\n");

                return lazyEmbed({
                    "title": "Quotes",
                    "message": `Page ${page} of ${totalPages}\n\n${quotesPage}`
                });
            };

            const actionRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(totalPages <= 1)
                );

            let currentPage = 1;
            const embedMessage = await interaction.reply({
                embeds: [generateEmbed(currentPage)],
                components: [actionRow],
                ephemeral: !(interaction.channel.name.includes("command") || interaction.channel.name.includes("bot"))
            });

            const filter = i => i.user.id === interaction.user.id;
            const collector = embedMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'prev') {
                    currentPage--;
                } else if (i.customId === 'next') {
                    currentPage++;
                }

                await i.update({
                    embeds: [generateEmbed(currentPage)],
                    components: [new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('prev')
                                .setLabel('Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 1),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === totalPages)
                        )]
                });
            });

            collector.on('end', async () => {
                await embedMessage.edit({
                    components: [new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('prev')
                                .setLabel('Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true)
                        )]
                });
            });

        } catch (error) {
            console.error("Error fetching quotes:", error);
            interaction.reply("An error occurred while fetching quotes.");
        }
    },
};
