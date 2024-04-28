const {EmbedBuilder} = require("discord.js")
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
module.exports = ({title="QuoteDB",message,color=("#"+genRanHex(6))})=>{
    let embed = new EmbedBuilder()
	.setTitle(title)
    .setColor(color)
    .setDescription(message+"\n")
    .setFooter({"text":"QuoteDB 0.1.0a"});

    return embed
}