const Discord=require('discord.js');
const pg=require('pg');
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
    async execute(message, args) {
        const db=new pg.Client({
            connectionString:process.env.DATABASE_URL,
            ssl:true
        })
        await db.connect()
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
            await Csr.CSRBan(message.client,db,banee)
            message.channel.send(`Boi <@${banee.id}> you have been temp banned for ${ms(ms(time),{long:true})}`)
            setTimeout(() => {
                await Csr.CSRUnban(message.client,db,banee)
                message.channel.send(`Unbanned <@${banee.id}>, Ban duration (${ms(time)})`)
                await db.end()
            }, ms(time)); 
}

    }

};