const Discord = require('discord.js');
const system = require('./csrSys');
const Bot = require('./bot');
const client = new Bot();
const jndb = require('jndb');
const fs = require('fs');
const commandHandler = require('easy-djs-commandhandler');
// @ts-ignore
require('./env').load('.env');
const prefix = process.env.prefix || 'c-';
const testing = process.env.testing || false;
const cmdHandler = new commandHandler.Handler(client, {
	prefix: prefix,
	owner: ['298258003470319616', '193406800614129664'],
	defaultcmds: true,
	prefixFunc: (message) => {
		if (!message.guild) return prefix;
		return client.prefixDB.fetch(message.guild.id) || prefix;
	},
});
// /**
//  * @type {Map<string,string>}
//  */
// const allCmds = new Map();
// fs.readdir(`./commands/`, (err, files) => {
// 	// read dir
// 	const jsfile = files.filter(
// 		(f) =>
// 			f.split('.').pop() === 'js' &&
// 			!fs.statSync(process.cwd() + `/commands/` + f).isDirectory()
// 	); // get all .js files
// 	const categorys = files.filter((f) =>
// 		fs.statSync(process.cwd() + `/commands/` + f).isDirectory()
// 	);

// 	jsfile.forEach((f, i) => {
// 		// if commands present
// 		try {
// 			const props = require(`${process.cwd()}/commands/${f}`); // => load each one

// 			if (props.help.aliases && !Array.isArray(props.help.aliases))
// 				props.help.aliases = [props.help.aliases];
// 			allCmds.set(props.help.name, `${process.cwd()}/commands/${f}`); // => add command to command list
// 		} catch (err) {}
// 	});
// 	categorys.forEach((category) => {
// 		const catfiles = fs
// 			.readdirSync(`./commands/` + category)
// 			.filter(
// 				(f) =>
// 					f.split('.').pop() === 'js' &&
// 					!fs
// 						.statSync(process.cwd() + `/commands/` + category + '/' + f)
// 						.isDirectory()
// 			);
// 		catfiles.forEach((f, i) => {
// 			try {
// 				const props = require(`${process.cwd()}/commands/${category}/${f}`); // => load each one

// 				props.help.category = category;
// 				if (props.help.aliases && !Array.isArray(props.help.aliases))
// 					props.help.aliases = [props.help.aliases];
// 				allCmds.set(
// 					props.help.name,
// 					`${process.cwd()}/commands/${category}/${f}`
// 				); // => add command to command list
// 			} catch (err) {}
// 		});
// 	});
// });
// function unload(cmd) {
// 	client.commands.delete(cmd);
// }
// function load(cmd) {
// 	if (!allCmds.has(cmd)) return;
// 	const file = allCmds.get(cmd);
// 	const props = require(file);
// 	client.commands.set(props.help.name, props);
// }
const noInvites = /(discord\.gg\/|invite\.gg\/|discord\.io\/|discordapp\.com\/invite\/)/;
// ////////////////////////////////////////////////////////////////////////////
client.on('ready', async () => {
	if(!Boolean(testing)){
		//client.unload('new')
		client.user.setActivity(
			`${prefix}help`
		);
	}
	else{
		client.user.setActivity(
			`${prefix}help|${prefix}new to check out whats new`
		);
	}
	console.log('irc connected');
	client.debug('bot init');
	client.db.use('data');
	const rows = client.db.fetch('bans');
	if (rows) {
		for (const i in rows) {
			client.banlist.set(i, rows[i]);
		}
	}
	/**
	 * @type {string[]}
	 */
	let words = client.db.secure('filter', []);
	if (words.length) {
		for (let word of words) {
			client.filter.push(word);
		}
	}
	client.backup();
	await client.system.webhookManager.fetchWebhooks();
});

// //////////////////////////////////////////////////////////////////////////////////

client.on('guildCreate', async (guild) => {
	if (!guild.available) {
		return;
	}
	console.log('joined server ' + guild.name);
	/**
	 * @type {Discord.TextChannel}
	 */
	// @ts-ignore
	let irc = await guild.createChannel('irc', { type: 'text' }).catch(() => {});
	if (irc) {
		await irc.send(client.rules).catch(() => {});
		let webhook = await irc.createWebhook('csr').catch(() => {});
		if (webhook) client.system.webhookManager.add(guild, { private: webhook });
		client.system.channels.create(guild, { publicChannel: irc });
	}
	const ed = new Discord.RichEmbed()
		.setColor(client.color)
		// @ts-ignore
		.setAuthor(`${guild.name}`, guild.iconURL || client.user.defaultAvatarURL)
		.setDescription(`has joined ${client.system.findEmoji('join')}`);
	client.system.sendAll(ed);
});
// ////////////////////////////////////////////////////////////////////////////
client.on('guildDelete', (guild) => {
	if (!guild.available) {
		return;
	}
	if (!client.system.channels.public.has(guild.id))
		client.system.channels.delete(guild, 'private');
	client.system.channels.delete(guild, 'all');
	console.log('bot removed from server ' + guild.name);
	const ed = new Discord.RichEmbed()
		.setColor(client.color)
		// @ts-ignore
		.setAuthor(`${guild.name}`, guild.iconURL || client.user.defaultAvatarURL)
		.setDescription(`has left ${client.system.findEmoji('leave')}`);
	client.system.sendAll(ed);
});
// ///////////MAIN MESSAGE EVENT/////////////////////////////////////////////
client.on('message', (message) => {
	if (message.content.startsWith(prefix)) return;
	if (
		message.author == client.user ||
		message.author.bot ||
		!message.guild ||
		message.system
	)
		return;
	// if (noInvites.test(message.content)) return;
	// if (lockdownExpired(limitTime)) {
	// 	endLockdown();
	// }
	if (client.lockdown.enabled && !client.staff.has(message.author.id)) return;
	const channel = client.system.getChannels(message.guild).public;
	const privchannel = client.system.getChannels(message.guild).private;
	if (channel && message.channel.id === channel.id) {
		if (client.csrCooldowns.has(message.author.id)) {
			return;
		}
		broadcastToAllCSRChannels(message);
		client.csrCooldowns.set(message.author.id, null);
		setTimeout(() => {
			client.csrCooldowns.delete(message.author.id);
		}, 2000);
	} else if (privchannel && message.channel.id === privchannel.id) {
		sendPrivate(message);
	}
});
/////////////////////////
client.on('messageReactionAdd', (reaction, user) => {
	let message = reaction.message;
	let guild = message.guild;
	let channel = message.channel;
	let ircChannel = client.system.getChannels(guild).public;
	if (
		!message.embeds[0] ||
		message.author.id != client.user.id ||
		!(ircChannel && ircChannel.id === channel.id)
	) {
		return;
	}
	let CSRMessageAuthor = client.users.find(
		(x) => x.tag == message.embeds[0].author.name
	);
	if (
		!CSRMessageAuthor ||
		(CSRMessageAuthor.id != user.id && !client.staff.has(user.id))
	) {
		return;
	}
	let messages = client.system.findMatchingMessages(
		CSRMessageAuthor.tag,
		message.embeds[0].description
	);

	messages.forEach((msg) => msg.delete().catch((e) => {}));
});
// ///////////////////////////////////////////
client.on('message', (message) => {
	cmdHandler.handle(client, message);
});
// /RATE LIMIT EVENT/////////////////////////////////////////////////////////////
let limitcount = 0;
const limitTime = 0;
client.on('rateLimit', (ratelimit) => {
	console.log(ratelimit);
	if (ratelimit) {
		limitcount += 1;
		if (limitcount >= 3) {
			initLockdown();
			client.lockdown.time += 7000;
			limitcount = 0;
		}
	}
});

/**
 *
 * @param {Discord.Message} message
 */
async function broadcastToAllCSRChannels(message) {
	// @ts-ignore
	if (message.author.createdAt > new Date().getTime() - 604800000) {
		return;
	}
	if (client.filter.some((word) => message.cleanContent.includes(word))) {
		return;
	}
	if (client.banlist.has(message.author.id)) {
		return;
	}
	// if(!message.attachments.size && !message.deleted) {
	//	message.delete(500);
	// }
	const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	await wait(1000);
	if (client.system.style.public == 'embed') {
		const embed = generateEmbed(message);
		message.channel.send(embed);
		client.system.sendAll(embed, { ignoreGuilds: [message.guild.id] });
	} else if (client.system.style.public == 'webhook') {
		await client.system.webhookManager.fetchWebhooks();
		await client.system.sendAllWebHooks(message);
	} else if (client.system.style.public == 'wembed') {
		const embed = generateEmbed(message);
		await client.system.webhookManager.fetchWebhooks();
		client.system.webhookManager.webhooks.public.forEach(async (webhook) => {
			if (webhook.name !== client.user.username) {
				await webhook.edit(client.user.username, client.user.avatarURL);
			}
			await webhook.send(embed).catch((e) => {
				//client.system.webhookManager.delete(
				//	client.guilds.get(webhook.guildID),
				//	'public'
				//);
			});
		});
	}
}

/**
 *
 * @param {Discord.Message} message
 */
async function sendPrivate(message) {
	const channel = client.system.getChannels(message.guild).private;
	if (!channel) {
		return;
	}

	if (!message.attachments.size && message.deletable) {
		message.delete(500).catch((e) => {});
	}
	const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	await wait(1000);

	const ed = generateEmbed(message);
	//const channels = client.system.getMatchingPrivate(message.guild);
	// channels.forEach((ch) => {
	// 	/*if(!ch.nsfw && ch.topic.includes('nsfw')) {
	// 		return ch.send('Received new Message\nBut this Channel is not NSFW').catch(e=>{
	// 			console.log(e);
	// 			if(e.message == 'Unknown Channel') {
	// 				// cachePrivateChannels();
	// 			}
	// 		});
	// 	}*/

	// 	ch.send(ed).catch((e) => {
	// 		console.log(e);
	// 		if (e.message == 'Unknown Channel') {
	// 			// cachePrivateChannels();
	// 		}
	// 	});
	// });
	await client.system.sendPrivateWebHooks(message.guild, message);
}
// ///error event./////////////////

client.on('error', (err) => {
	console.log(err);
});

// unhandled rej ///////////////////////////////////////////////////////////////////////
process.on('unhandledRejection', (err) => {
	console.error(err);
	if (err.name == 'DiscordAPIError' && err.message == '401: Unauthorized')
		return process.exit();

	if (err.name == 'DiscordAPIError') {
		let addInfo = 'None Found!';
		if (err.path !== undefined) {
			const split = err.path.split('/');
			const info = getDebugInfo(split);
			addInfo = `Additional Debug Info:\n\tChannel: ${
				info.channel ? info.channel.name : 'Unknown'
			}\n\tGuild: ${
				info.channel
					? info.channel.guild
						? info.channel.guild.name
						: 'Unknown'
					: 'Unknown'
			}\n\tmessage content:${
				info.message ? info.message.cleanContent : 'None Found!'
			}}`;
		}

		// @ts-ignore
		return client.channels.get('543167247330312232').send(`
	\`\`\`js
	Error: ${require('util')
		.inspect(err)
		.slice(0, 1800)}

	${addInfo}
		\`\`\`
		`);
	}

	// @ts-ignore
	return client.channels.get('543167247330312232').send(`
\`\`\`xs
Error: ${err.name}
    ${err.message}
    ${err.stack}
    \`\`\`
    `);
});

function getDebugInfo(arr) {
	const data = {};
	if (arr[3] == 'channels') {
		const channel = client.channels.get(arr[4]);
		if (channel) {
			data.channel = channel;
			// @ts-ignore
			data.guild = channel.guild;
		}
	}
	if (arr[3] == 'guilds') {
		const guild = client.guilds.get(arr[4]);
		if (guild) {
			data.guild = guild;
		}
	}
	if (!arr[5]) return data;

	if (arr[5] == 'permissions') {
		// @ts-ignore
		const role = data.channel.guild.roles.get(arr[6]);
		if (role) {
			data.role = role;
		}
	}
	if (arr[5] == 'messages') {
		const channel = client.channels.get(arr[4]);
		if (channel) {
			// @ts-ignore
			const msg = channel.messages.get(arr[6]);
			if (msg) {
				data.message = msg;
			}
		}
	}
	return data;
}

/**
 *
 *
 * @param {Discord.Message} message
 * @returns {Discord.RichEmbed}
 */
function generateEmbed(message) {
	const relayEmbed = new Discord.RichEmbed()
		// @ts-ignore
		.setAuthor(
			`${message.author.tag}`,
			message.author.displayAvatarURL,
			`https://discordapp.com/users/${message.author.id}`
		)
		.setDescription(message.cleanContent)
		.setTimestamp(new Date())
		.setFooter(
			message.guild.name,
			message.guild.iconURL || client.user.defaultAvatarURL
		);
	if (client.staff.has(message.author.id)) {
		relayEmbed.setColor([0, 0, 128]);
	} else if (message.author.id === message.guild.owner.id) {
		relayEmbed.setColor([205, 205, 0]);
	} else {
		relayEmbed.setColor([133, 133, 133]);
	}

	// find and add image
	if (message.attachments.array()[0]) {
		const img = message.attachments.array()[0];
		let images = ['.jpg', '.jpeg', '.png', '.gif', '.PNG'];
		if (images.some((x) => img.filename.endsWith(x))) {
			relayEmbed.setImage(img.url);
		} else {
			relayEmbed.addField('Attachment', img.url, false);
		}
	}
	// fetch external embeds and place them there
	const externalembed = new Discord.RichEmbed(message.embeds[0]);
	// if(externalembed) {
	externalembed.title && externalembed.description
		? relayEmbed.addField(`${externalembed.title}`, externalembed.description)
		: '';
	externalembed.thumbnail
		? relayEmbed.setThumbnail(externalembed.thumbnail.url)
		: '';
	// }
	return relayEmbed;
}

function lockdownExpired(time) {
	// console.log(client.lockdown.time);
	const x = new Date().getTime();
	const timeleft = x - time;
	if (timeleft > time || !time) {
		return true;
	} else {
		return false;
	}
}
function initLockdown() {
	client.lockdown.enabled = true;
	client.user.setActivity(`${prefix}help | locking down due to ratelimits`);
}

function endLockdown() {
	client.lockdown.enabled = false;
	client.lockdown.time = 0;
	client.user.setActivity(`${prefix}help`);
}
// /////////////////////////////////////////////////////////////////////////////////
client.login(process.env.token);
