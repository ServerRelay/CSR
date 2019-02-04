const Discord=require('discord.js');
const sqlite=require('sqlite3');
const csr=require('./banfuncs.js')
const {staff}=require('./stafflist.json')


function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   }
   

module.exports = {
    name: 'guildban',
    staff:'ban a whole guild by id or name',
   execute(message, args) {
    const db=new sqlite.Database('./banDB.sqlite',(err)=>{
        if (err) {
            console.log('Could not connect to database', err)
          }    
    });

    if(!args[0]){
        return message.channel.send('please specify a server, we dont want accidental bans')
    }
        if(staff.findIndex(x=>x===message.author.id)==-1){
            message.channel.send('no permission')
            return
        }
        let guild=message.client.guilds.get(args[0]) || message.client.guilds.find(x=>x.name.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
        if(guild){
            let o=0
          for(let i of guild.members.array()){
              o+=1
              csr.CSRBan(message.client,db,i,()=>{
                  
              })
          }
          message.channel.send(`banned ${o} members`)
        }
        else{
            return message.channel.send('not found')
        }
    }

};