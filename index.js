const { Client, Collection } = require('discord.js');

const client = new Client({
  disableEveryone: true
});

const auth = require('./auth.json');

client.commands = new Collection();
client.aliases = new Collection();

// Do Not Change
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
      status: "online",
      game: {
        name: "Bot Development",
        type: "WATCHING"
      }
    })
});

// Run the command loader
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

// Greeting Upon New People Joining
client.on("guildMemberAdd", member => {
  const channel = member.guild.channels.find(ch => ch.name === 'general');

  if (!channel) return;
  channel.send(`Welcome To The Server, ${member}`);
});

// Commands
client.on("message", async message => {
  const prefix = "!";

  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  // If message.member is uncached, cache it.
  if (!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  
  if (cmd.length === 0) return;
  
  // Get the command
  let command = client.commands.get(cmd);
  // If none is found, try to find it by alias
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  // If a command is finally found, run the command
  if (command) 
      command.run(client, message, args);
});

// Do Not Change
client.login(auth.token);