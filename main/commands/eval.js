const { SlashCommandBuilder,Interaction,Client } = require('discord.js');
const cmd = require('node-cmd');
const process = require("process")
const path = require("path")
const lazyEmbed = require("../lazyEmbed.js")
const config = require("../config.json")

const { readdir, stat } = require('fs/promises');

const dirSize = async directory => {
  const files = await readdir( directory );
  const stats = files.map( file => stat( path.join( directory, file ) ) );

  return ( await Promise.all( stats ) ).reduce( ( accumulator, { size } ) => accumulator + size, 0 );
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates code')
        .addStringOption(option => option.setName('code').setDescription('The code you want to eval').setRequired(true)),

        /**
         * 
         * @param {Interaction} interaction 
         * @param {Client} client
         * 
         */
    async execute(interaction, client, db) {
        
        try{
            if(config.eval!==true){
                await interaction.reply("haha eval isn't enabled")
                return
            }
            // Check if the user is a developer
            const devs = ["880898058483814430", "906283767734362144", "1170452569848549429"];
            if (!devs.includes(interaction.member.id)) {
                return interaction.channel.send("You do not have permission to use this command.");
            }
            let result = eval(interaction.options._hoistedOptions[0].value)
            await interaction.reply({embeds:[lazyEmbed({
                "title":"Eval",
                "message":result,
            })],ephemeral:false});
            
        }catch(err){
            console.warn(err)
            await interaction.reply("Something went wrong! Check logs.")
        }
        


    },
};
