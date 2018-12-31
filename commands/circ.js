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
    name: 'circ',
   execute(message, args) {
      if(message.author.id!=='298258003470319616'){
          message.channel.send("NO")
          return 
      }
      message.author.send('scanning servers...')
        message.client.guilds.forEach(sv => {
            let irc=sv.channels.find(x=>x.name==='irc')
            if(!irc){
             
                message.author.send(`created ${sv.name} \'s irc channel`)
                sv.createChannel('irc',type='text')
               .catch((error)=>{
        // console.log('wasnt allowed to make irc channel['+error+']')
         message.author.send(`{${sv.name}} wasnt allowed to create irc channel [${error}]`)
    });

            }
        })
    }
};