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
    name: 'sysmsg',
   execute(message, args) {
        if(message.author.id!='298258003470319616'){return;}
                let ed=new Discord.RichEmbed()
                .setColor(rgbToHex(255,0,0))
                ed.addField(name='**IMPORTANT MESSAGE**',value=args.join(' '),inline=false)

                message.client.guilds.forEach(ch => {
                    let irc=ch.channels.find(x=>x.name==='irc')
                    if(irc){
                    irc.send(RichEmbed=ed)
                    }

                });
            



    },
};