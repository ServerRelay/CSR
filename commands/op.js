const Discord=require('discord.js');
const fs=require('fs')
function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   }

module.exports = {
    name: 'op',
    execute(message, args) {
      if(message.author.id!=='298258003470319616'){
          message.channel.send('NOPE')
          return 
      }
      let person=message.mentions.members.first()
      if(person){
         let staffinfo=fs.readFileSync(`commands/stafflist.json`,'utf8')
         let arr=JSON.parse(staffinfo)
         arr.staff.push(person.id)
         
         
         fs.writeFile('commands/stafflist.json',JSON.stringify(arr),(err)=>{
             if(err){
                 console.log(err)
             }
             else{
                
                 message.channel.send('successful')
             }
         })
      }

    },
};