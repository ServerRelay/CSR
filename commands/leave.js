const Discord=require('discord.js');

function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   }

module.exports = {
    name: 'leave',
  execute(message, args) {
       if(message.author.id!=="298258003470319616"){
          return message.send('nope')
       }
       let guild=message.client.guilds.get(args[0]) || message.client.guilds.find(x=>x.name.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
    if(guild){
        guild.leave()
        message.channel.send(`left ${guild.name}`)
    }
    else{
        return message.channel.send('not found')
    }
    },
};