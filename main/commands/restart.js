const { SlashCommandBuilder } = require('discord.js');
const cmd = require('node-cmd');
const process = require("process")
const path = require("path")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Fetches github repo and then restarts.'),

    async execute(interaction, client, db) {
        

        // Check if the user is a developer
        const devs = ["880898058483814430", "906283767734362144", "1170452569848549429"];
        if (!devs.includes(interaction.member.id)) {
            return interaction.channel.send("You do not have permission to use this command.");
        }

        // Announce restart
        console.log("Commencing restart...");

        // Check if the command is being run in QuoteDB
        const allowedGuildId = "1234184478335828012";
        if (interaction.guildId !== allowedGuildId) {
            await interaction.channel.send("Please run this command in the QuoteDB server for announcement");
        }else{
            // Announce restart
            console.log("Announcing restart...")
            const restartChannelId = '1234190000653074603';
            const restartChannel = await client.channels.fetch(restartChannelId);
            if (restartChannel) {
                await restartChannel.send("# Restarting...");
            }
        }

        //shuts down the DB so no errors are generated.
        console.log("Shutting down DB...")
        db.shutdown()

        // Change dir
        if(path.resolve(".").endsWith("main")){
            console.log("Chaning directory...")
            process.chdir("../")
        }

        // Pull
        console.log("Pulling changes...")
        const result = cmd.runSync("git pull https://github.com/ReallyBadDeveloper/QuoteDB/ main");
        const replyMessage = result.data + "\n\n (Restarting. This may take some time...)";
        await interaction.channel.send(replyMessage);
        
        // Exit the process to restart the bot
        console.log("Exiting process")
        process.exit();
    },
};
