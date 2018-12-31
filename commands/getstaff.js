const Discord=require('discord.js');
   

module.exports = {
    name: 'getstaff',
    staff:'get staff list',
    execute(message, args) {
      if(message.author.id!=='298258003470319616'){
          message.channel.send("NO")
          return 
      }
    message.channel.send({
        files:["./commands/stafflist.json"]
    })
    }
};