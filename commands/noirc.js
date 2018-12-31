const Discord=require('discord.js')

module.exports = {
    name: 'noirc',
    execute(message, args) {
        
              message.client.guilds.forEach(sv => {
                let irc=sv.channels.find(x=>x.name==='irc')
                if(!irc){
                    message.author.send(sv.name+' doesnt have an irc channel')
                }

              });
            

    },
};