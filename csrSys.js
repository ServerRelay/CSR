const discord = require('discord.js');
const jndb = require('jndb');
class CSRSystem {
	/**
	 *
	 * @param {discord.Client} client
	 */
	constructor(client, channel = 'irc') {
		this.client = client;
		this.channel = channel;
	}
	/**
	 *
	 * @readonly
	 * @returns {Map<string,discord.TextChannel}
	 */
	get channels() {
		let db = new jndb.Connection();
		db.use('channels');
		let channels = db.fetchAll();
		const chs = new Map();
		for (let i in channels) {
			if (!channels[i].public.id) {
				continue;
			}
			let guild = this.client.guilds.get(i);
			if (!guild) {
				db.delete(i);
				continue;
			}
			let channel = guild.channels.get(channels[i].public.id);
			if (!channel) {
				channels[i].public = { id: null, name: null };
				db.insert(channels);
				continue;
			}
			chs.set(i, channel);
		}
		return chs;
	}
	/**
	 *
	 * @readonly
	 * @returns {Map<string,discord.TextChannel}
	 */
	get privateChannels() {
		let db = new jndb.Connection();
		db.use('channels');
		let channels = db.fetchAll();
		const chs = new Map();
		for (let i in channels) {
			if (!channels[i].private.id) {
				continue;
			}
			let guild = this.client.guilds.get(i);
			if (!guild) {
				db.delete(i);
				continue;
			}
			let channel = guild.channels.get(channels[i].private.id);
			if (!channel) {
				channels[i].private = { id: null, name: null, passcode: null };
				db.insert(channels);
				continue;
			}
			channel.passcode = channels[i].private.passcode;
			chs.set(i, channel);
		}
		return chs;
	}
	/**
	 *
	 * @param {discord.Guild} guild
	 * @returns {discord.TextChannel}
	 */
	getChannel(guild) {
		const channels = this.channels;
		return channels.get(guild.id);
	}
	/**
	 *
	 * @param {discord.Guild} guild
	 * @returns {discord.TextChannel}
	 */
	getPrivateChannel(guild) {
		const channels = this.privateChannels;
		return channels.get(guild.id);
	}
	/**
	 *
	 * @param {string|discord.RichEmbed} message
	 * @param {{ignoreGuilds:string[]}} param1
	 */
	sendAll(message, { ignoreGuilds = [] } = { ignoreGuilds: [] }) {
		const channels = this.channels;
		channels.forEach((ch) => {
			if (ignoreGuilds.length && ignoreGuilds.includes(ch.guild.id)) {
				return;
			}
			ch.send(message).catch((e) => {
				console.log('error sending message in sendAll:\n' + e);
			});
		});
	}
	/**
	 * @param {string|discord.RichEmbed} message
	 */
	sendAllPrivate(message) {
		const channels = this.privateChannels;
		channels.forEach((ch) => {
			ch.send(message).catch((e) => {
				console.log('error sending message in sendAll:\n' + e);
			});
		});
	}
	/**
	 *
	 * @param {discord.Guild} guild
	 * @returns {Map<string,discord.TextChannel}
	 */
	getMatchingPrivate(guild) {
		const channels = new Map();
		const channel = this.getPrivateChannel(guild);
		if (!channel) {
			return;
		}
		const channelsToMatch = this.privateChannels;
		channelsToMatch.forEach((ch, chGuild) => {
			if (!ch) {
				return;
			}
			if (ch.passcode === channel.passcode) {
				channels.set(chGuild, ch);
			}
		});
		return channels;
	}
	/**
	 *
	 * @param {string|discord.RichEmbed} message
	 * @param {discord.guild} guild
	 */
	sendPrivate(message, guild) {
		const channel = this.getPrivateChannel(guild);
		if (!channel) {
			return;
		}
		const channels = this.getMatchingPrivate(guild);
		channels.forEach((ch) => {
			ch.send(message).catch((e) => {
				console.log(e);
				if (e.message == 'Unknown Channel') {
					// cachePrivateChannels();
				}
			});
		});
	}
	/**
	 *
	 * @param {string} name
	 * @returns {discord.Emoji}
	 */
	findEmoji(name) {
		const res = this.client.emojis.find((x) => x.name == name);
		return res;
	}
	/**
	 *
	 * @param {string} tag
	 * @param {string} content
	 * @returns {discord.Collection<string,discord.Message>}
	 */
	findMatchingMessages(tag, content) {
		let messages = new discord.Collection();
		this.channels.forEach((channel) => {
			let msg = channel.messages
				.filter(
					(msg) =>
						msg.author.id == this.client.user.id &&
						(msg.embeds &&
							msg.embeds[0].author.name == tag &&
							msg.embeds[0].description == content)
				)
				.last();
			if (!msg) {
				return;
			}
			messages.set(msg.id, msg);
		});
		return messages;
	}
	/**
	 *
	 * @param {string} string
	 * @returns {discord.Guild[]}
	 */
	findCloseServers(string) {
		const svs = [];
		this.client.guilds.forEach((guild) => {
			if (guild.name.toLowerCase().includes(string.toLowerCase())) {
				svs.push(guild);
			}
		});
		return svs;
	}
	/**
	 * @param {discord.Guild[]} svs
	 * @param {discord.Message} message
	 * @returns {discord.Guild}
	 */
	async obtainServer(message, svs) {
		const msg =
			svs.length > 1
				? await message.author.send(
						`this is a list of possible servers that were found:\`\`\`\n${svs
							.map((x, idx) => idx + '. ' + x.name)
							.join(
								'\n'
							)}\`\`\`\nplease type the number that corresponds with the server to select it`,
						{ split: true }
				  )
				: await message.author.send('there was only 1 server found');
		const filter = (m) => !m.author.bot;
		const collector =
			svs.length > 1
				? await msg.channel.awaitMessages(filter, {
						max: 1,
						time: 60000,
				  })
				: '';
		if (svs.length > 1 && !collector.size) {
			return message.author.send('no choice made');
		}
		/**
		 * @type {Discord.Guild}
		 */
		const guild = svs.length > 1 ? svs[collector.first().content] : svs[0];
		return guild;
	}
}

module.exports = CSRSystem;
