const { SlashCommandBuilder } = require('discord.js');
const cmd = require('node-cmd');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Fetches github repo and then restarts.'),

    async execute(interaction, client) {

        // Check if the user is a developer
        const devs = ["880898058483814430", "906283767734362144", "1170452569848549429"];
        if (!devs.includes(interaction.member.id)) {
            return interaction.channel.send("You do not have permission to use this command.");
        }

        // Check if the command is being run in QuoteDB
        const allowedGuildId = "1234184478335828012";
        if (interaction.guildId !== allowedGuildId) {
            return interaction.channel.send("Please run this command in the QuoteDB server.");
        }

        // Pull
        const result = cmd.runSync("git pull");
        const replyMessage = result.data + "\n\n (Restarting. This may take some time...)";
        await interaction.channel.send(replyMessage);

        // Log and announce restart
        console.log("Restarting...");
        const restartChannelId = '1234190000653074603';
        const restartChannel = await client.channels.fetch(restartChannelId);
        if (restartChannel) {
            await restartChannel.send("# Restarting...");
        }

        // Exit the process to restart the bot
        process.exit();
    },
};
