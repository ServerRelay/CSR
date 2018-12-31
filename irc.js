const Discord=require('discord.js');
const code=require('./ircrules.js')
const client=new Discord.Client();
const ms=require('ms')
const fs=require('fs');

const Url=require('url');

const sqlite=require('sqlite3');
const spam=require(`./spamdetect.js`)
const bansys=require('./commands/banfuncs')

const db=new sqlite.Database('./banDB.sqlite',(err)=>{
    if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('Connected to database')
      }

});


client.commands=new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.banlist=[]
bannedservers=[]
const {prefix, token}=require('./config.json');


client.on('ready',()=>{

console.log('irc connected')

client.user.setActivity('--help')

db.all(`SELECT * FROM banned`,function(err,rows){
    client.banlist.splice(0)
    if(typeof(rows)!='undefined' &&rows.length>0){
        for(let i in rows){
            client.banlist.push(rows[i]['id'])
        }
  
    }
    if(err){
        console.log(err)
        
    }
});

});



function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   }
function finds(str, needle){
    if (str.indexOf(needle) == -1){
        return false
    }
    else{
        return true
    }

}

function findemoji(name){
    let em=client.guilds.get('497475921855381525').emojis.find(x=>x.name===name)
    if(em){
          return em
    }
    else{
        error('no emoji found')
    }
}

async function waitembed(channel,embed){
if(channel){
    await channel.send(RichEmbed=embed)
    
}

};



async function waitsend(channel,[...args]){
    if(channel){
    await channel.send(args.join(' '))
    .catch((err)=>{
        console.log(`error:${err.errno}\n${err.code}`)
    })
   
}
}

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}




client.on('guildCreate',(guild)=>{
    guild.owner.send('Thanks for adding me')

    let cd=new Discord.RichEmbed()
    .setColor(rgbToHex(0,200,138))
    .setDescription(code)
    .setFooter('IRC Code Of Conduct',icon=client.user.avatarURL)
    let t=guild.createChannel('irc',type='text')
    .then((channel)=>{
        channel.send('**make sure you read the rules before proceding**',RichEmbed=cd)
    })
    .catch((error)=>{
        guild.owner.send('this bot needs a channel (#irc) to do its intended function')
        console.log('wasnt allowed to make irc channel')
    });

console.log('joined server '+guild.name)

let ed=new Discord.RichEmbed()
.setColor(rgbToHex(0,255,0))
.setAuthor(`${guild.name}`,url=(guild.iconURL||client.user.defaultAvatarURL))
.setDescription(`has joined the chat ${findemoji('join')}` )

client.guilds.forEach((element) => {
    let ch=element.channels.find(x=>x.name==='irc')
    if(ch){
       
        waitembed(ch,ed)
      }
    });
});

client.on('guildDelete',(guild)=>{
console.log('bot removed from server '+guild.name)
let ed=new Discord.RichEmbed()
        .setColor(rgbToHex(255,0,0))
        .setAuthor(`${guild.name}`,url=(guild.iconURL||client.user.defaultAvatarURL))
        .setDescription(`has left the chat ${findemoji('leave')}` )
        
client.guilds.forEach((element) => {
    let ch=element.channels.find(x=>x.name==='irc')
    if(ch){
        waitembed(ch,ed)
      }
    });
    
});

client.on('message',(message)=>{
if (message.author==client.user){return};
try{
global.ch=message.guild.channels.find(x=>x.name==='irc')
}
catch(err){

}
if(message.system){
    return
}

if(ch && message.channel.id==ch.id){
      if(!finds(message.content,'@here') &&!finds(message.content,'@everyone') &&!finds(message.content,'discord.gg')){
        
        
if(message.author.id!==client.user.id && message.author.createdTimestamp<(604800000-new Date().getMilliseconds())){
    return
    }
     
        if(client.banlist.findIndex(x=>x===message.author.id)!=-1){
            return
    
        }
       
        let st=''
       
        /*if(message.guild.id==='495583899104182275'){
            st=st+`${findemoji('support')}`
        }
        if(special.findIndex(x=>x===message.guild.id)!=-1){
            st=st+`${findemoji('vip')}`
        }
        if(comm.findIndex(x=>x===message.guild.id)!=-1){
            //st=st+'(**``Community``**)'
            st=st+`${findemoji('com')}`
        }
       */
      
       // client.user.setAvatar(message.author.avatarURL)
        //if(message.content===''){
        //    return
        //}
         let ed=new Discord.RichEmbed()
            .setColor()
            .setAuthor(name=`${message.author.username}`,icon=(message.author.avatarURL||message.author.defaultAvatarURL),url=`https://discordapp.com/users/${message.author.id}`)
            .setDescription(message.cleanContent)
            .setTimestamp(new Date())
            .setFooter(message.guild.name,(message.guild.iconURL||client.user.defaultAvatarURL))
        const {staff}=require(`./commands/stafflist.json`)  
        if(staff.includes(message.author.id)){
            ed.setColor(rgbToHex(0,0,128))
        }
        else if(message.author.id===message.guild.owner.id){
            ed.setColor(rgbToHex(205,205,0))
        }
        else{
            ed.setColor(rgbToHex(133,133,133))
        }


            let args=message.content.split(' ')
            if(message.content.match(RegExp(`/(http|https)?(.jpg|.png)?/`))){
                let uri=message.content.split(' ')
                uri=uri.find(x=>x.match(`(http|https)?`))
                let ur=Url.parse(uri)
            
               //console.log(message.embeds[0])
                if(ur.pathname.endsWith('.jpg')||ur.pathname.endsWith('.png')||ur.pathname.endsWith('.gif')||ur.pathname.endsWith('.jpeg')){
                    ed.setImage(ur.href)

                }
                if(ur.host==`www.youtube.com`||ur.host==`youtu.be`){
                    //todo - add video embed to embed i.e. https://www.youtube.com/embed/4PAAaFNEIXA
                    try{
                    let arr=message.content.split(' ')
                    console.log(arr)
                    arr.splice(arr.findIndex(x=>x.includes(`http`)||x.includes(`https`)),1)
                    arr=arr.join(' ')
                
                    ed.setTitle(message.embeds[0].title)
                    ed.setURL(message.embeds[0].video.url)
                    ed.setDescription(arr)
                    ed.setImage(message.embeds[0].video.url)
                    ed.setThumbnail(message.embeds[0].thumbnail.url)
                    
                
                    
                    }
                    catch(err){
                        console.log(err)
                    }
                    //setTimeout(() => {
                       // message.delete()
                       // .catch((err)=>{
                        //    console.log(err)
                       // })
                   // }, 3000); 
            }
        }      
          else if(message.attachments.array().length>0){
                let img = message.attachments.array()[0];
                if(img.filename.endsWith('.jpg')||img.filename.endsWith('.png')||img.filename.endsWith('.gif')||img.filename.endsWith('.jpeg')){
                   //console.log(img)
                 ed.setImage(url=img.url)
                    setTimeout(() => {
                       // message.delete()
                       // .catch((err)=>{
                        //    console.log(err.code)
                        //})
                    }, 2000);
                }
                else{
                    ed.addField('Attachment',img.url,false)
                    //message.delete()
                    //.catch((err)=>{
                       // console.log(err.code)
                    //})
                }
               
            }
            else{
                    message.delete()
                    .catch((err)=>{
                        console.log(err)
                    })
               
            }
           

           client.guilds.forEach((element) => {
            let ch=element.channels.find(x=>x.name==='irc')
           // if(!ch.permissionsFor(element.id).has('VIEW_CHANNEL')) {
            //    ch.overwritePermissions(element.id,{"VIEW_CHANNEL":true})
           // }
            if(ch){
                //waitsend(ch,)
              waitembed(ch,ed)
              }
            

        });
    


//async (message)

    }
      

}

});

client.on('message',(message)=>{

    if (!message.content.startsWith(prefix) || message.author.bot) {return;}

const args = message.content.slice(prefix.length).trim().split(/ +/g);

const commandName = args.shift().toLowerCase();

//if(!client.commands.has(commandName)){return;}

const command=client.commands.get(commandName) || client.commands.find(x=>x.alias && x.alias.includes(commandName))
if(!command){return}
try {

    command.execute(message, args);
    
} catch (error) {

    console.error(error);
    message.channel.send(`there was an error trying to execute that command![${error}]`);
  
};

});

spam(client,{
    warningMessage: "stop spamming or I'll make sure you wont message here again.", 
    banMessage: "has been banned for spamming, anyone else?", // Ban message, always tags the banned user in front of it.
    maxDuplicatesWarning: 2,// Maximum amount of duplicate messages a user can send in a timespan before getting warned
    maxDuplicatesBan: 4, // Maximum amount of duplicate messages a user can send in a timespan before getting banned
    deleteMessagesAfterBanForPastDays: 7,// Delete the spammed messages after banning for the past x days.
    exemptRoles: [], // The names of the roles which should not be spam-filtered
    exemptUsers: [], // The Discord tags of the users who should not be spam-filtered
}, function(message,author){
   
        if(client.banlist.findIndex(x=>x===author.id)!=-1){
            return 
        }
        let d=new Discord.RichEmbed()
        .setColor(rgbToHex(255,0,0))
        .setAuthor(`${author.username} has been found spamming and has been removed`,icon=author.avatarURL)
        client.guilds.forEach((element) => {
            let ch=element.channels.find(x=>x.name==='irc')
            if(ch){
                //waitsend(ch,)
              waitembed(ch,d)
              }
    })
        db.run(`CREATE TABLE IF NOT EXISTS banned (id TEXT)`,function(err){
            if(err){
            message.channel.send(`error creating table[${err}]`)
            }
            else{
                db.run(`INSERT OR REPLACE INTO banned (id) VALUES (?)`,[author.id],function(err){
                    if(err){
                        message.channel.send(`error adding to DB[${err}]`)
                    }
                    else{
                        client.banlist.push(author.id)
                        message.channel.send('added to DB') 
                    }
                })
            }
    
        });
    
        client.banlist.push(author.id)
    
   

})

client.on('rateLimit',(ratelimit)=>{
    let counter=0
    if(ratelimit){
        counter+=1
    }
    if(counter>=5){
    client.destroy()
    .then(()=>{    
           client.login(process.env.TOKEN)

    })
    counter=0
}
})
client.on('error',(error)=>{
    console.log(error)
})


client.login(process.env.TOKEN)//process.env.TOKEN