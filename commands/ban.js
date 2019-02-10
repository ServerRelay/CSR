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
    name: 'ban',
    staff:'adds someone to the ban database How to use: --ban (@mention)',
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
        let banee=message.mentions.members.first()||message.client.users.get(args[0])
        //let banee=message.guild.members.find(x=>x.user.username.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
if(banee){
  csr.CSRBan(message.client,db,banee,()=>{
      message.channel.send(`${message.client.users.get(banee.id).username} has been banned`)
      db.close()
  })
    
}
else{
    message.channel.send('not found')
    db.close()
}

    }

};