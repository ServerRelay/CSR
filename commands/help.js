const Discord=require('discord.js');
const fs=require('fs')
function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   }
let hlp={}
module.exports = {
    name: 'help',
    execute(message, args) {
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            
            const command=require(`./${file}`)
            let i=''
            if(command.alias){
                i=i+' | '+command.alias.join(' ')
            }
            if(command.description){
            hlp[`${command.name}${i}`]=command.description
            }
            //message.client.commands.delete(command.name)
            
            
        }
        let ed=new Discord.RichEmbed()
        .setColor(rgbToHex(0,138,138))
        /*hlp={
            '**```support```**':'sends an invite to join the support server.',
            '**```servers```**':'sends the ammount of servers that include this bot.',
            '**```ping```**':'gets the bot latency and api latency.',
            '**```invite```**':'sends an invite link to add the bot to your server.',
            '**```(community contribution) code```**':'prints the IRC Code of Conduct.',
            '**``(community contribution)join | joins``**':'sends a request to join the server',
            '**```report (user name)```**':'reports an user who is causing trouble or breaking the CoC.',
            '**```suggest```**':'send a suggestion to help in improving the bot',
            '**```staffhelp```**':"commands that are specifically only to CSR Staff"
        }*/
       for(let i in hlp){
           ed.addField(name=i,value=hlp[i],inline=false)
       }
       ed.setFooter('help section')

        message.channel.send(RichEmbed=ed)
    


    },
};