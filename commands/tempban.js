const Discord=require('discord.js');
const sqlite=require('sqlite3');
const ms=require('ms')
const Csr=require(`./banfuncs.js`)
const {staff}=require('./stafflist.json')
//const {staff}=require('./stafflist.json')


function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   }
   

module.exports = {
    name: 'tempban',
    alias:['tban'],
   staff:'bans an user for a set ammount of time',
    execute(message, args) {
        const db=new sqlite.Database('./banDB.sqlite',(err)=>{
            if (err) {
                console.log('Could not connect to database', err)
              } else {
                console.log('Connected to ban database')
              }
        
        });
        if(staff.findIndex(x=>x===message.author.id)==-1){
            message.channel.send('no permission')
            return
        }
        let banee=message.mentions.members.first()||message.client.users.get(args[0])
        args.shift()
        let time=args.shift()
        if(!banee){message.channel.send('who do you expect me to ban?'); return db.close()}
        if(!time){ message.channel.send('BOI If you dont choose the time'); return db.close()}
        //let banee=message.guild.members.find(x=>x.user.username.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
if(banee){
    Csr.CSRBan(message.client,db,banee,(err)=>{
        if(err){
            message.channel.send(`error adding to DB[${err}]`)
        }
        else{
            console.log(typeof(banee))
            message.channel.send(`Boi <@${banee.id}> you have been temp banned for ${ms(ms(time),{long:true})}`)
        }
    })

   setTimeout(() => {
       Csr.CSRUnban(message.client,db,banee,(err)=>{
           
           message.channel.send(`Unbanned <@${banee.id}>, Ban duration (${ms(time)})`)
           db.close()
       })
   }, ms(time)); 
}

    }

};