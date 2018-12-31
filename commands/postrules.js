const Discord=require('discord.js');
const code=require('../ircrules.js')
function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   }

module.exports = {
    name: 'postrules',
    staff: 'sends the rules on the #irc channel',
    execute(message, args) {
        if(message.author.id!=="298258003470319616"){
            return;
        }
        let ed=new Discord.RichEmbed()
        .setColor(rgbToHex(0,200,138))
       
        ed.setDescription(code)
       ed.setFooter('IRC Code Of Conduct',icon=message.client.user.avatarURL)

      message.client.guilds.forEach(async(element) => {
        let ch=element.channels.find(x=>x.name==='irc')
        if(ch){
            await ch.send(RichEmbed=ed)
          }
        

    });


    },
};