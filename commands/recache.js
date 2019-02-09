const discord=require('discord.js')
module.exports={
    name:'recache',
    description:'makes the bot detect #irc and #privateirc channels',
    /**
     * 
     * @param {discord.Message} message 
     * @param {Array<String>} args 
     */
    execute(message,args){
        let ch=message.guild.channels.find(x=>x.name==='irc')
        let privatech=message.guild.channels.find(x=>x.name==='privateirc')
        if(!message.guild.CSRChannel){
            if(ch){
                message.guild.CSRChannel=ch
                message.channel.send(`irc channel cached , now you can use it`)
            }
        }
         if(!message.guild.privateCSRChannel){
            if(privatech){
                message.guild.privateCSRChannel=privatech
                message.channel.send('privateirc channel cached')
            }
        }
    }
}