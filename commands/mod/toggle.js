const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const db = require('wio.db');


module.exports = {
  name: "toggle",
  aliases: ["enable", "disable", "command"],
  usage: "enable-disable <command name> <on or off>",
  description: "Enable Or Disable A Command!",
  run: async (client, message, args) => {

          const Perms = new Discord.MessageEmbed()
          .setColor(15158332)
          .setDescription('You Do Not Have Permission To Do That! You Need The Permission **``Manage Server``**.')
      if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(Perms);

        const Name = args[0];
          const GiveName = new Discord.MessageEmbed()
          .setColor(15158332)
          .setDescription('Please Give A Command Name')
        if (!Name) return message.channel.send(GiveName);

        const cmd = client.commands.get(Name.toLowerCase());

          const NotFound = new Discord.MessageEmbed()
          .setColor(15158332)
          .setDescription('Command Not Found')
        if (!cmd) return message.channel.send(NotFound);

        const Type = args[1];

          const TypeEmbed = new Discord.MessageEmbed()
          .setColor(15158332)
          .setDescription('Please Give A Command Type - On | Off')
        if (!Type) return message.channel.send(TypeEmbed);

        let array = ["on", "off"];

  const InvalidType = new Discord.MessageEmbed()
          .setColor(15158332)
          .setDescription('Invalid Type - On | Off')
        if (!array.find(a => a === Type.toLowerCase())) return message.channel.send(InvalidType);

        const Current = await db.fetch(`CommandOn_${message.guild.id}_${Name.toLowerCase()}`);
          const Already = new Discord.MessageEmbed()
          .setColor(15158332)
          .setDescription(`Its Already ${Current}!`)
        if (Current && Current.toLowerCase() === Type.toLowerCase()) return message.channel.send(Already);

        if (Current === null && Type.toLowerCase() === "on") return message.channel.send(`Its Already On!`);

        let Upper = Type.charAt(0).toUpperCase() + Type.slice(1);

        await db.set(`CommandOn_${message.guild.id}_${Name.toLowerCase()}`, Type.toLowerCase() === "on" ? null : Upper);

        let Embed = new MessageEmbed()

        .setTitle(`Success`)
        .setDescription(`Command Has Been ${Upper === "On" ? "Enabled" : "Disabled"} - <@${message.author.id}>`)
        .setFooter(`Requested By ${message.author.username}`)
        .setTimestamp();

        return message.channel.send(Embed);



  }
}
