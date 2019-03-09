const Discord = require('discord.js');
const code = require('./ircrules.js');
const client = new Discord.Client();
const fs = require('fs');
const pg = require('pg');
require('./env').load('.env');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.banlist = new Discord.Collection();
client.lockdown = false;
const { prefix } = require('./config.json');
client.cooldowns = new Discord.Collection();
client.csrchannels = new Discord.Collection();
const novites = /(discord\.gg\/|invite\.gg\/|discord\.io\/|discordapp\.com\/invite\/)/;
// ////////////////////////////////////////////////////////////////////////////
client.on('ready', async ()=>{
	console.log('irc connected');
	client.user.setActivity(`${prefix}help`);

	const db = new pg.Client({
		connectionString:process.env.DATABASE_URL,
		ssl:true,
	});
	await db.connect();

	await db.query('CREATE TABLE IF NOT EXISTS banned(id text UNIQUE)');
	let rows = await db.query('SELECT * FROM banned');
	rows = rows.rows;
	if(typeof (rows) != 'undefined' && rows.length > 0) {
		for(const i in rows) {
			client.banlist.set(rows[i]['id'], true);
		}
	}


	await db.end();

	cacheCSRChannels();
	console.log('cached all csr channels');
	cachePrivateChannels();
	console.log('cached private channels');

});

// //////////////////////////////////////////////////////////////////////////////////

function rgbToHex(R, G, B) {return toHex(R) + toHex(G) + toHex(B);}

function toHex(n) {
	n = parseInt(n, 10);
	if (isNaN(n)) return '00';
	n = Math.max(0, Math.min(n, 255));
	return '0123456789ABCDEF'.charAt((n - n % 16) / 16)
        + '0123456789ABCDEF'.charAt(n % 16);
}

function findemoji(name) {
	const em = client.guilds.get('497475921855381525').emojis.find(x=>x.name === name);
	if(em) {
		return em;
	}
	else{
		new Error('no emoji found');
	}
}


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}


// ////////////////////////////////////////////////////////
client.on('guildCreate', (guild)=>{
	guild.owner.send('Thanks for adding me\nfor information use the help command')
		.catch(()=>{
			console.log(`${guild.owner} doesnt have dms on`);
		});
	const cd = new Discord.RichEmbed()
		.setColor(rgbToHex(0, 200, 138))
		.setDescription(code)
		.setFooter('IRC Code Of Conduct', client.user.avatarURL);
	guild.createChannel('irc', 'text')
		.then((channel)=>{
			channel.send('**make sure you read the rules before proceding**', cd);
			cacheCSRChannels();
			cachePrivateChannels();
		})
		.catch(()=>{
			return guild.owner.send('this bot needs a channel (#irc) to do its intended function');
		});

	console.log('joined server ' + guild.name);

	const ed = new Discord.RichEmbed()
		.setColor(rgbToHex(0, 255, 0))
		.setAuthor(`${guild.name}`, (guild.iconURL || client.user.defaultAvatarURL))
		.setDescription(`has joined the chat ${findemoji('join')}`);

	client.csrchannels.forEach(async (ch) => {
		ch.send(ed)
			.catch(e=>{
				console.log('on join error ' + e.message + ch.guild.name);
			});
	});
});
// ////////////////////////////////////////////////////////////////////////////
client.on('guildDelete', (guild)=>{
	console.log('bot removed from server ' + guild.name);
	const ed = new Discord.RichEmbed()
		.setColor(rgbToHex(255, 0, 0))
		.setAuthor(`${guild.name}`, (guild.iconURL || client.user.defaultAvatarURL))
		.setDescription(`has left the chat ${findemoji('leave')}`);

	client.csrchannels.forEach(async (ch) => {
		ch.send(ed)
			.catch(e=>{
				console.log('on leave error ' + e.message + ch.guild.name);
			});
	});

});
// ///////////MAIN MESSAGE EVENT/////////////////////////////////////////////
client.on('message', (message)=>{

	if (message.author == client.user) {return;}
	if(!message.guild) {return;}
	if(message.system) { return;}
	if(message.author.bot) {return;}
	if(novites.test(message.content)) {return;}
	if(message.content.includes('﷽') || message.guild.name.includes('﷽') || message.cleanContent.includes('﷽') || message.author.tag.includes('﷽')) return;
	const { staff } = require('./commands/stafflist.json');
	if(client.lockdown && !staff.includes(message.author.id)) { return;}

	if(client.csrchannels.has(message.channel.id)) {
		if(!client.cooldowns.has(message.author.id)) {
			boadcastToAllCSRChannels(message);
			client.cooldowns.set(message.author.id);
			setTimeout(() => {
				client.cooldowns.delete(message.author.id);
			}, 2000);
		}
		else{
			console.log('ignoring');
		}
	}
	else if(message.guild.privateCSRChannel && message.channel.id === message.guild.privateCSRChannel.id) {
		sendPrivate(message);
	}
});
// ////////////RECACHE TO ChANNEL CREATE//////////////////////////////////
client.on('channelCreate', (channel)=>{
	if(channel.type != 'text') {
		return;
	}
	if(channel.name && channel.name !== 'irc' && channel.name !== 'privateirc') {
		return;
	}
	cacheCSRChannels();
	cachePrivateChannels();
});
// //////////////////////////////////////////////////
client.on('channelUpdate', (oldch, newch)=>{
	if(newch.type != 'text') {return;}
	if(newch.name && newch.name !== 'irc' && newch.name !== 'privateirc') {
		return;
	}
	cacheCSRChannels();
	cachePrivateChannels();
});
// ///////////////////////////////////////////
client.on('message', (message)=>{

	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix})\\s*`);
	if (!prefixRegex.test(message.content)) return;
	const [, matchedPrefix] = message.content.match(prefixRegex);
	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	// if(!client.commands.has(commandName)){return;}

	const command = client.commands.get(commandName) || client.commands.find(x=>x.alias && x.alias.includes(commandName));
	if(!command) {return;}
	try {

		command.execute(message, args);

	}
	catch (error) {

		console.error(error);
		message.channel.send(`there was an error trying to execute that command![${error}]`);

	}

});

let limitcount = 0;
client.on('rateLimit', (ratelimit)=>{
	if(ratelimit) {
		limitcount += 1;
		if(limitcount >= 3) {
			client.destroy()
				.then(()=>{
					client.login(process.env.TOKEN);
				});
			limitcount = 0;
		}
	}
});
client.on('error', (error)=>{
	console.log(error);
});

function cacheCSRChannels() {
	client.csrchannels.clear();
	client.guilds.forEach(async (guild)=>{
		if(!guild.available) {
			return;
		}
		const ch = guild.channels.find(x=>x.name === 'irc');
		if(ch) {
			client.csrchannels.set(ch.id, ch);
		}
	});
}

function cachePrivateChannels() {
	client.guilds.forEach(async (guild)=>{
		if(!guild.available) {
			return;
		}
		const ch = guild.channels.find(x=>x.name === 'privateirc');
		if(ch) {
			guild.privateCSRChannel = ch;
		}

	});
}

function findAllMatchingPrivate(ogguild) {
	if(!ogguild.privateCSRChannel || !ogguild.privateCSRChannel.topic || ogguild.privateCSRChannel.topic === '') {
		return;
	}
	const arr = [];
	client.guilds.forEach(guild=>{
		if(!guild.privateCSRChannel || !guild.privateCSRChannel.topic || guild.privateCSRChannel.topic === '') {
			return;
		}

		if(guild.privateCSRChannel.topic === ogguild.privateCSRChannel.topic) {
			arr.push(guild.privateCSRChannel);
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
	});
	return arr;
}

/**
 *
 * @param {Discord.Message} message
 */
function boadcastToAllCSRChannels(message) {
	if(message.author.id !== client.user.id && message.author.createdTimestamp < (604800000 - new Date().getMilliseconds())) {
		return;
	}

	if(client.banlist.has(message.author.id)) {
		return;

	}

	setTimeout(() => {
		if(!message.deleted) {
			message.delete();
		}
	}, 180000);

	const ed = new Discord.RichEmbed()
		.setColor()
		.setAuthor(`${message.author.username}`, (message.author.avatarURL || message.author.defaultAvatarURL), `https://discordapp.com/users/${message.author.id}`)
		.setDescription(message.cleanContent)
		.setTimestamp(new Date())
		.setFooter(message.guild.name, (message.guild.iconURL || client.user.defaultAvatarURL));
	const { staff } = require('./commands/stafflist.json');
	if(staff.includes(message.author.id)) {
		ed.setColor(rgbToHex(0, 0, 128));
	}
	else if(message.author.id === message.guild.owner.id) {
		ed.setColor(rgbToHex(205, 205, 0));
	}
	else{
		ed.setColor(rgbToHex(133, 133, 133));
	}

	if(message.attachments.array()[0]) {
		const img = message.attachments.array()[0];
		if(img.filename.endsWith('.jpg') || img.filename.endsWith('.png') || img.filename.endsWith('.gif') || img.filename.endsWith('.jpeg') || img.filename.endsWith('.PNG')) {
			// console.log(img)
			ed.setImage(img.url);
		}
		else{
			ed.addField('Attachment', img.url, false);
		}

	}
	const externalembed = message.embeds[0];
	if(externalembed) {
		externalembed.title ? externalembed.description ? ed.addField(`${externalembed.title}`, externalembed.description) : '' : '';
		externalembed.thumbnail.url ? ed.setThumbnail(externalembed.thumbnail.url) : '';

	}
	client.csrchannels.forEach(async (ch) => {
		try{
			await ch.send(ed);
		}
		catch(e) {
			console.log(e.name + '[]' + e.message);
			if(e.message == 'Unknown Channel') {
				cacheCSRChannels();
			}
		}
	});
}


/**
 *
 * @param {Discord.Message} message
 */
function sendPrivate(message) {
	if(!message.guild.privateCSRChannel.topic || message.guild.privateCSRChannel.topic === '') {return;}

	setTimeout(() => {
		if(!message.deleted) {
			message.delete();
		}
	}, 180000);

	const ed = new Discord.RichEmbed()
		.setColor()
		.setAuthor(`${message.author.username}`, (message.author.avatarURL || message.author.defaultAvatarURL), `https://discordapp.com/users/${message.author.id}`)
		.setDescription(message.cleanContent)
		.setTimestamp(new Date())
		.setFooter(message.guild.name, (message.guild.iconURL || client.user.defaultAvatarURL));
	const { staff } = require('./commands/stafflist.json');
	if(staff.includes(message.author.id)) {
		ed.setColor(rgbToHex(0, 0, 128));
	}
	else if(message.author.id === message.guild.owner.id) {
		ed.setColor(rgbToHex(205, 205, 0));
	}
	else{
		ed.setColor(rgbToHex(133, 133, 133));
	}


	const attachment = message.attachments.first();
	if(attachment) {
		if(attachment.filename.endsWith('.jpg') || attachment.filename.endsWith('.png') || attachment.filename.endsWith('.gif') || attachment.filename.endsWith('.jpeg')) {
			ed.setImage(attachment.url);
		}
		else{
			ed.addField('Attachment', attachment.url, false);
		}
	}
	const channels = findAllMatchingPrivate(message.guild);
	for(const i of channels) {
		i.send(ed)
			.catch(e=>{
				console.log(e);
				if(e.message == 'Unknown Channel') {
					cachePrivateChannels();
				}
			});
	}
}

// ///////////////////////////////////////////////////////////////////////
process.on('unhandledRejection', (err) => {
	console.error(err);
	if (err.name == 'DiscordAPIError' && err.message == '401: Unauthorized') return process.exit();

	if(err.name == 'DiscordAPIError') {
		let addInfo = 'None Found!';
		if(err.path !== undefined) {
			const split = err.path.split('/');
			const info = getDebugInfo(split);
			addInfo = `Additional Debug Info:\n\tChannel: ${info.channel.name ? info.channel.name : 'Unknown'}\n\tGuild: ${info.channel.guild ? info.channel.guild.name : 'Unknown'}\n\tmessage content:${info.message.cleanContent}`;
		}

		return (client.channels.get('543167247330312232')).send(`
	\`\`\`js
	Error: ${require('util').inspect(err).slice(0, 1800)}

	${addInfo}
		\`\`\`
		`);
	}


	return (client.channels.get('543167247330312232')).send(`
\`\`\`xs
Error: ${err.name}
    ${err.message}
    ${err.stack}
    \`\`\`
    `);
});

function getDebugInfo(arr) {
	const data = {};
	if(arr[3] == 'channels') {
		const channel = client.channels.get(arr[4]);
		if(channel) {
			data.channel = channel;
			data.guild = channel.guild;
		}
	}
	if(arr[3] == 'guilds') {
		const guild = client.guilds.get(arr[4]);
		if(guild) {
			data.guild = guild;
		}
	}
	if(!arr[5])return data;

	if(arr[5] == 'permissions') {
		const role = data.channel.guild.roles.get(arr[6]);
		if(role) {
			data.role = role;
		}

	}
	if(arr[5] == 'messages') {
		const msg = client.channels.get(arr[4]).messages.get(arr[6]);
		if(msg) {
			data.message = msg;
		}
	}
	return data;
}
// /////////////////////////////////////////////////////////////////////////////////
client.login(process.env.token);
