module.exports = {
  name: "ping",
  aliases: [],
  usage: "ping",
  description: "pong",
  run: async (client, message, args) => {
  
  
  message.channel.send("pong")
  
  }
}
