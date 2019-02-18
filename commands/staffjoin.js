const Discord=require('discord.js');
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
    name: 'staffjoin',
    alias:['staffjoins'],
    staff: 'sends a join request to a server',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {[]} args 
     */
    async execute(message, args) {
        if(staff.findIndex(x=>x===message.author.id)!==-1){
        let sv=message.client.guilds.find(x=>x.name.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
        if(!sv.me.hasPermission('CREATE_INSTANT_INVITE')||!sv.me.hasPermission('ADMINISTRATOR')){
            return message.channel.send('insifficient permissions in the guild ypu want to join')
        }
        if(sv){
            let ch=sv.channels.find(x=>x.name==='irc')
            if (ch){
                const bans= await sv.fetchBans()
                if(bans.has(message.author.id)){
                    await sv.unban(message.author.id)
                }
              message.author.send(`staff bypass`)
                ch.createInvite({maxAge:0},'someone requested to join this server')
            .then((invite)=>{
                message.author.send(`${sv.name}\'s invite code:${invite.url}`)
            })
            .catch((err)=>{
                console.log(err)
            });
                }
            }
            return
        }
        
    else{
        message.author.send(`could not find the desired server, either try a more/less precise search or it maybe just doesnt exist`)
    }
    },
};