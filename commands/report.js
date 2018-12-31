const Discord=require('discord.js')
function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)};

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   };

module.exports = {
    name: 'report',
    description: 'report people',
    execute(message, args) {
      let st=''
      
    let us=message.guild.members.find(x=>x.user.username.toLowerCase().indexOf(args.join(' '))!=-1)
      const d=new Discord.RichEmbed()
    .setColor(rgbToHex(200,0,0))
    d.setAuthor(name='report from '+message.author.username+' ('+message.guild.name+')',url=message.author.avatarURL)
    d.addField(name='user(s)',value=us+' id:'+us.id,inline=false)
      message.client.channels.get('495713365646376982').send(RichEmbed=d)
    },
};