const Discord=require('discord.js');

function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)};

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   };

module.exports = {
    name: 'servers',
    description: 'sends list of total ammount of servers',
    execute(message, args) {
        if(message.author.id==='298258003470319616'){
            let st=0
            message.client.guilds.forEach(sv => {
                st=st+ sv.memberCount
            });

            message.author.send(`\`\`\`md\n${message.client.guilds.size}\n <total servers>\n${st}\n <total users/members>\`\`\``)

        }
        else{
            message.author.send(`\`\`\`md\n${message.client.guilds.size}\n <total servers>\`\`\``)



    }

},
};