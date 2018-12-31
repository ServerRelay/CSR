const Discord=require('discord.js');



module.exports = {
    name: 'leavenoirc',
   execute(message, args) {
      if(!message.author.id==="298258003470319616"){return}
              message.client.guilds.forEach(sv => {
                let irc=sv.channels.find(x=>x.name==='irc')
                if(!irc){
                message.author.send(`removed from ${sv.name} due to no irc channel`)
                sv.leave()
                }
              });


    },
};