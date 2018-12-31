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
    name: 'refreshinv',
    execute(message, args) {
      
          if(message.author.id===message.guild.owner.id){
        let ch=message.guild.channels.find(x=>x.name==='irc')
        if (ch){
           message.guild.fetchInvites()
           .then((inv)=>{
               let x=inv.find(inv => inv.inviter.id === '486615250376851477')
                if(x){
                    x.delete()
                  }
                })
            .then(
            ch.createInvite({maxAge:0},'someone requested to join this server')
            .then((invite)=>{
                message.author.send(`${message.guild.name}\'s refreshed invite code:\n${invite.url}`)
            })
            .catch((err)=>{
                console.log(err)
            })
            )
        }
    }

    },
};