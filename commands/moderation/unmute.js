const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "unmute",
    category: "moderation",
    description: "unmutes the member",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "moderation") || message.channel;

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to unmute.")
                .then(m => m.delete(5000));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to unmute.")
                .then(m => m.delete(5000));
        }

        // No author permissions
        if (!message.member.hasPermission("MUTE_MEMBERS")) {
            return message.reply("❌ You do not have permissions to unmute members. Please contact a staff member")
                .then(m => m.delete(5000));
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("MUTE_MEMBERS")) {
            return message.reply("❌ I do not have permissions to unmute members. Please contact a staff member")
                .then(m => m.delete(5000));
        }

        const toMute = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toMute) {
            return message.reply("Couldn't find that member, try again")
                .then(m => m.delete(5000));
        }

        // Can't kick urself
        if (toMute.id === message.author.id) {
            return message.reply("You can't unmute yourself...")
                .then(m => m.delete(5000));
        }

        // Check if the user's kickable
        if (!toMute.kickable) {
            return message.reply("I can't unmute that person due to role hierarchy, I suppose.")
                .then(m => m.delete(5000));
        }

        const channel = message.guild.channels.find(c => c.name === "general")
            
        if (!channel)
            return message.channel.send("Couldn't find a `#general` channel").then(m => m.delete(5000));
                
        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toMute.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> Unmuted member:** ${toMute} (${toMute.id})
            **> Unmuted by:** ${message.member} (${message.member.id})
            **> Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to Unmute ${toMute}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // The verification stuffs
            if (emoji === "✅") {
                msg.delete();

                toMute.setMute = false

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Unmute canceled.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};