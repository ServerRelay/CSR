const Discord=require('discord.js');



module.exports = {
    name: 'alertirc',
    execute(message, args) {
   
              message.client.guilds.forEach(sv => {
                let irc=sv.channels.find(x=>x.name==='irc')
                if(!irc){
                    sv.owner.send('channel ( #irc ) needed to do my base function')
                    console.log(sv.name+'('+sv.owner.user.username+') has been warned about my function')
                }
              });


    },
};