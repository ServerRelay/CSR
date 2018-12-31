const Discord=require('discord.js');
   

module.exports = {
    name: 'getdb',
    staff:'get ban database',
    execute(message, args) {
      if(message.author.id!=='298258003470319616'){
          message.channel.send("NO")
          return 
      }
    message.channel.send({
        files:["./banDB.sqlite"]
    })
    }
};