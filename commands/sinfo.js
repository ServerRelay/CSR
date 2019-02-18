const Discord=require('discord.js');
const {staff}=require('./stafflist.json')
function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)};

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   };

module.exports = {
    name: 'sinfo',
    alias:['serverinfo'],
    staff:'gets info on a server,How to use: --sinfo (server name)',
     execute(message, args) {
        if(staff.findIndex(x=>x===message.author.id)!==-1){
            const d=new Discord.RichEmbed()
            .setColor(rgbToHex(0,200,200))
            let sv=message.client.guilds.find(x=>x.name.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
            d.setAuthor('information about server: '+sv.name,url=sv.iconURL)
            if(sv){
                d.addField(name='server owner',value=sv.owner+'\ntag: '+sv.owner.user.tag,inline=false)
                d.setThumbnail((sv.owner.avatarURL||sv.owner.defaultAvatarURL))
                d.addField(name='server id',value=sv.id,inline=false)
              
                let x=0
                let bot=0
                
                for(let i of sv.members.array()){
                
                    if(i.user.bot===true){
                        bot+=1
                    }
                    else{
                        x+=1
                    }
                   //console.log(i)
                }
                d.addField(name=`members: ${sv.members.size}`,value=`members: ${x}/ bots: ${bot}`,inline=false)
            }
            message.channel.send(RichEmbed=d)
        }
  
 
},
};