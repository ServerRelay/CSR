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
    name: 'unban',
    staff:'removes someone from the database How to use: --unban (@mention)',
    execute(message, args) {
        const db=new sqlite.Database('./banDB.sqlite',(err)=>{
            if (err) {
                console.log('Could not connect to database', err)
              }
        });
        if(staff.findIndex(x=>x===message.author.id)==-1){
            message.channel.send('no permission')
            return
        }
        //let banee=message.guild.members.find(x=>x.user.username.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
        let banee=message.mentions.members.first()||message.client.users.get(args[0])
if(banee){

csr.CSRUnban(message.client,db,banee,()=>{
message.channel.send('removed from DB')
db.close()
})

}


    }

};