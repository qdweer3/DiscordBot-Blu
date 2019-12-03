const { Client, Collection } = require('discord.js');
const { config } = require("dotenv");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("./functions");
var request = require("request");
var fs = require("fs");

const client = new Client({
  disableEveryone: true
});

config({
  path: __dirname + "/.env"
});

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

var online;

client.on('ready', () => {
  //var channel = client.channels.get('651186596682661941');
  var channel = client.channels.find(ch => ch.name === 'announcements');
  
  if (online == true) {
    var isOnline = setInterval(isOnline, 300000);
  } else {
    var isOnline = setInterval(isOnline, 60000);
  }
 

  function isOnline() {
    var options = { method: 'GET',
        url: 'https://api.twitch.tv/helix/streams?user_login=dreamofwhiteroses',
        headers:{ 'Client-ID': '3h1w0cvre78wdaa4tcm0w794r3xhjo' } };

    request(options, function (error, response, body) {
        var data = JSON.parse(body);

        if (data && data.data[0]) {
            console.log(" is online!");
            channel.send("@everyone" + " User Is Now Streaming On Twitch!");
            online = true;
        } else {
            console.log(" is not online");
            online =  false;
        }
        if (error) throw new Error(error);
        //console.log(JSON.parse(body));
    });
  }
});

// Do Not Change
client.login(process.env.TOKEN);