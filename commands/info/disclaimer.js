module.exports = {
    name: "disclaimer",
    description: "Defines This Bots Right To Use Certain Assets",
    run: async (client, message, args) => {
        const embed = new RichEmbed()
                .setColor("#ff0000")
                .setTitle("Disclaimer!")
                .setTimestamp()
                .setFooter(message.guild.name, message.guild.iconURL)
                .setAuthor(message.author.username, rMember.user.displayAvatarURL)
                .setDescription(`Disclaimer:
                    
                    !! All Works Of Art Used In The Creation Or Modification Of This Bot Are Property Of PotoatoBlu !!

                    Please Contact Evelyn Howard If You Intend To Copy, Redistribute Or Modify Graphical Components Of This Project.
                    All Graphical Assets Are Not Convered Under The GPL 3.0, They Are The Sole Property Of PotatoBlu.`
                    );

            return message.channel.send(embed);
    }
}