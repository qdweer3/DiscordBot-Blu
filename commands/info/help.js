const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "help",
    description: "Returns All Commands",
    run: async (client, message, args) => {
        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!rMember)
            return message.reply("Couldn't find that person?").then(m => m.delete(5000));

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setTitle("Help Guide: Bot Commands")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor(message.author.username, rMember.user.displayAvatarURL)
            .setDescription(stripIndents(`**> Prefix !! {parameters}**
            **> help {@userExample}** 
            **> ping {none}** 
            **> whois {@userExample}** 
            **> ban {@userExample}** 
            **> kick {@userExample}** 
            **> mute {@userExample}** 
            **> unmute {@userExample}** 
            **> report {@userExample}** 
            **> say {embed, string}**`));

        return message.channel.send(embed);
    }
}