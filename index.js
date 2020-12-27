const discord = require('discord.js');
const fs = require('fs');
const db = require('wio.db');
const client = new discord.Client();
const cofig = require('./congig.json')

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.queue = new Map();


client.on("ready", async () => {
  console.log(`Bot Is Ready To Go - ${client.user.tag}`);
});

const Categories = ["mod", "misc"]; //Commands => Category => Command

Categories.forEach(async function(Category) { //
    fs.readdir(`./commands/${Category}`, async function(error, files) {
      if (error) throw new Error(`Error In Command - Command Handler\n${error}`);
      files.forEach(async function(file) {
        if (!file.endsWith(".js")) throw new Error(`A File Does Not Ends With .js - Command Handler!`);
        let command = require(`./commands/${Category}/${file}`);
   
        if (!command.name || !command.aliases) throw new Error(`No Command Name & Command Aliases In A File - Command Handler!`);
        if (command.name) client.commands.set(command.name, command);
        if (command.aliases) command.aliases.forEach(aliase => client.aliases.set(aliase, command.name));
        if (command.aliases.length === 0) command.aliases = null;
      });
    });
});

client.on("message", async message => {

  let Prefix = config.prefix;


  if (message.author.bot || !message.guild || message.webhookID) return;

  if (!message.content.startsWith(Prefix)) return;

  let args = message.content.slice(Prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();

  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if (!command) return console.log(`No Command Found!`);

  const Allowed = await db.fetch(`CommandOn_${message.guild.id}_${cmd.toLowerCase()}`);
  if (Allowed !== null) return;

  if (command) {
    command.run(client, message, args);
  };
});



client.login(process.env.TOKEN).catch(err => console.log(`Invalid Token Provided!`));
