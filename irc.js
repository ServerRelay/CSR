const Discord=require('discord.js');
const code=require('./ircrules.js')
const client=new Discord.Client();
const fs=require('fs');
const Url=require('url');
const sqlite=require('sqlite3');
client.commands=new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.banlist=[]
bannedservers=[]
const {prefix, token}=require('./config.json');

//////////////////////////////////////////////////////////////////////////////
client.on('ready',()=>{
console.log('irc connected')
client.user.setActivity('--help')

const db=new sqlite.Database('./banDB.sqlite',(err)=>{
    if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('cached all banned')
      }

});

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


db.close()

cacheCSRChannels()
console.log('cached all csr channels')
cachePrivateChannels()
console.log('cached private channels')

setInterval(() => {
    cacheCSRChannels()
    console.log('re-caching all csr channels')
    cachePrivateChannels()
    console.log('re-caching all private channels')
},1800000);


});

////////////////////////////////////////////////////////////////////////////////////

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



for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}



//////////////////////////////////////////////////////////
client.on('guildCreate',(guild)=>{
    guild.owner.send('Thanks for adding me\nfor information use the help command')

    let cd=new Discord.RichEmbed()
        .setColor(rgbToHex(0,200,138))
        .setDescription(code)
        .setFooter('IRC Code Of Conduct',client.user.avatarURL)
    guild.createChannel('irc','text')
        .then((channel)=>{
            channel.send('**make sure you read the rules before proceding**',cd)
            cacheCSRChannels()
            cachePrivateChannels()
        })
        .catch((error)=>{
            guild.owner.send('this bot needs a channel (#irc) to do its intended function')
            console.log('wasnt allowed to make irc channel')
        });

console.log('joined server '+guild.name)

let ed=new Discord.RichEmbed()
.setColor(rgbToHex(0,255,0))
.setAuthor(`${guild.name}`,(guild.iconURL||client.user.defaultAvatarURL))
.setDescription(`has joined the chat ${findemoji('join')}` )

client.guilds.forEach(async(guild) => {
    if(!guild.CSRChannel){return}
    guild.CSRChannel.send(ed)
    });
});
//////////////////////////////////////////////////////////////////////////////
client.on('guildDelete',(guild)=>{
console.log('bot removed from server '+guild.name)
let ed=new Discord.RichEmbed()
        .setColor(rgbToHex(255,0,0))
        .setAuthor(`${guild.name}`,(guild.iconURL||client.user.defaultAvatarURL))
        .setDescription(`has left the chat ${findemoji('leave')}` )
        
client.guilds.forEach(async(guild) => {
    if(!guild.CSRChannel){
        return
    }
    guild.CSRChannel.send(ed)
    });
    
});
//////////////////////////////////////////////////////////////
client.on('message',(message)=>{

if (message.author==client.user){return};
if(!message.guild){return}
if(message.system){ return}
if(finds(message.content,'discord.gg')){return}

if(message.guild.CSRChannel && message.channel.id===message.guild.CSRChannel.id){
    boadcastToAllCSRChannels(message) 
}
  
else if(message.guild.privateCSRChannel && message.channel.id===message.guild.privateCSRChannel.id){ 
    sendPrivate(message)
   
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


client.on('rateLimit',(ratelimit)=>{
  let x=0
    if(ratelimit){
        x+=1
        if(x>=3){
        client.destroy()
        .then(()=>{    
            client.login(process.env.TOKEN)

        })
        x=0
    }
    }
})
client.on('error',(error)=>{
    console.log(error)
})

function cacheCSRChannels(){
    client.guilds.forEach(async(guild)=>{
        if(!guild.available){
            return
        }
        let ch=guild.channels.find(x=>x.name==='irc')
        if(ch){
            guild.CSRChannel=ch
        }
    })
}

function cachePrivateChannels(){
    client.guilds.forEach(async(guild)=>{
        if(!guild.available){
            return
        }
        let ch=guild.channels.find(x=>x.name==='privateirc')
        if(ch){
            guild.privateCSRChannel=ch
        }
    })
}

function findAllMatchingPrivate(ogguild){
    if(!ogguild.privateCSRChannel || !ogguild.privateCSRChannel.topic || ogguild.privateCSRChannel.topic===''){
        return
    }
    let arr=[]
    client.guilds.forEach(guild=>{
        if(!guild.privateCSRChannel || !guild.privateCSRChannel.topic || guild.privateCSRChannel.topic===''){
            return
        }

        if(guild.privateCSRChannel.topic===ogguild.privateCSRChannel.topic){
            arr.push(guild.privateCSRChannel)
           /* guild.privateCSRChannel.fetchWebhooks()
            .then(wbs=>{
                let wb=wbs.find(x=>x.name=="csr")
                if(!wb){
                    try{
                    wb=guild.privateCSRChannel.createWebhook('csr')
                        .then(w=>{
                            guild.privateCSRChannel.CSRwebhook=w
                        })
                    }
                    catch(err){
                        console.log('wb err creating')
                    }
                    if(!wb){
                        //console.log('returning')
                        return
                    }
            }

            })*/
        }
    })
    return arr
}

/**
 * 
 * @param {Discord.Message} message 
 */
function boadcastToAllCSRChannels(message){
    if(message.author.id!==client.user.id && message.author.createdTimestamp<(604800000-new Date().getMilliseconds())){
        return
        }
        
            if(client.banlist.findIndex(x=>x===message.author.id)!=-1){
                return
        
            }
                message.delete(10000)
                .catch(e=>{
                })
            
            let ed=new Discord.RichEmbed()
                .setColor()
                .setAuthor(`${message.author.username}`,(message.author.avatarURL||message.author.defaultAvatarURL),`https://discordapp.com/users/${message.author.id}`)
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
                        //console.log(arr)
                        arr.splice(arr.findIndex(x=>x.includes(`http`)||x.includes(`https`)),1)
                        arr=arr.join(' ')
                    
                        ed.setTitle(message.embeds[0].title)
                        ed.setURL(message.embeds[0].video.url)
                        ed.setDescription(arr)
                        ed.setImage(message.embeds[0].video.url)
                        ed.setThumbnail(message.embeds[0].thumbnail.url)
                        
                           // ed=new Discord.RichEmbed(message.embeds[0])
                        
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
                    ed.setImage(img.url)
                }
                else{
                    ed.addField('Attachment',img.url,false)
                }
                
                }
            
            let extembed=message.embeds[0]
            if(extembed){
                ed.addField(`${extembed.title}`,extembed.description) 
                ed.setThumbnail(extembed.thumbnail.url)

            }
                client.guilds.forEach(async (guild) => {
                if(!guild.CSRChannel){
                    return
                }
                guild.CSRChannel.send(ed)
                .catch(e=>{
                    console.log(e)
                    guild.CSRChannel=undefined
                    cacheCSRChannels()
                })
            });
}


/**
 * 
 * @param {Discord.Message} message 
 */
function sendPrivate(message){
    if(!message.guild.privateCSRChannel.topic || message.guild.privateCSRChannel.topic===''){return}
        message.delete(10000)//180000 is 3 minutes
    let ed=new Discord.RichEmbed()
        .setColor()
        .setAuthor(`${message.author.username}`,(message.author.avatarURL||message.author.defaultAvatarURL),`https://discordapp.com/users/${message.author.id}`)
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


    let att=message.attachments.first()
    if(att){
        console.log('')
        if(att.filename.endsWith('.jpg')||att.filename.endsWith('.png')||att.filename.endsWith('.gif')||att.filename.endsWith('.jpeg')){
            ed.setImage(att.url)
        }
        else{
            ed.addField('Attachment',att.url,false)
        }
    }
   
    let channels=findAllMatchingPrivate(message.guild)
    for(let i of channels){
        i.send(ed)
        .catch(e=>{
            console.log(e)
            
            cachePrivateChannels()
        })
    }
}

/////////////////////////////////////////////////////////////////////////
process.on('unhandledRejection', (err) => { // OHH NO UNHANLED ERROR: NOTIFY ALL BOT DEVS
    console.error(err);
    if (err.name == 'DiscordAPIError' && err.message == '401: Unauthorized') return process.exit();
    (client.channels.get('0') || client.channels.get('543167247330312232')).send(`
\`\`\`xs
Error: ${err.name}
    ${err.message}
    ${err.stack}
    \`\`\`
    `);
});

///////////////////////////////////////////////////////////////////////////////////
client.login(process.env.token)//process.env.token