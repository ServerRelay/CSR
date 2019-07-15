const discord = require('discord.js');
const jndb = require('jndb');
class CSRSystem {
	/**
	 *
	 * @param {import('./bot')} client
	 */
	constructor(client, channel = 'irc') {
		this.client = client;
		this.channel = channel;
		this.db = new jndb.Connection();
		this.db.use('channels');
	}
	/**
	 *
	 * @readonly
	 * @returns {Map<string,PublicChannel>}
	 */
	get channels() {
		let channels = this.db.fetchAll();
		const chs = new Map();
		for (let i in channels) {
			if (!channels[i].public.id) {
				continue;
			}
			let guild = this.client.guilds.get(i);
			if (!guild) {
				this.db.delete(i);
				continue;
			}
			let channel = guild.channels.get(channels[i].public.id);
			if (!channel) {
				channels[i].public = { id: null, name: null };
				this.db.insert(channels);
				continue;
			}
			chs.set(i, new PublicChannel(this, channel));
		}
		return chs;
	}
	/**
	 *
	 * @readonly
	 * @returns {Map<string,PrivateChannel>}
	 */
	get privateChannels() {
		let channels = this.db.fetchAll();
		const chs = new Map();
		for (let i in channels) {
			if (!channels[i].private.id) {
				continue;
			}
			let guild = this.client.guilds.get(i);
			if (!guild) {
				this.db.delete(i);
				continue;
			}
			let channel = guild.channels.get(channels[i].private.id);
			if (!channel) {
				channels[i].private = { id: null, name: null, passcode: null };
				this.db.insert(channels);
				continue;
			}
			channel.passcode = channels[i].private.passcode;
			chs.set(i, new PrivateChannel(this, channel, channel.passcode));
		}
		return chs;
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
		const channel = this.privateChannels.get(guild.id);
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
		const channel = this.privateChannels.get(guild);
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
		 * @type {discord.Guild}
		 */
		const guild = svs.length > 1 ? svs[collector.first().content] : svs[0];
		return guild;
	}
	/**
	 *
	 * @param {discord.User} user
	 */
	ban(user) {
		let db = new jndb.Connection();
		db.use('data');
		this.client.banlist.set(user.id, user.tag);
		const data = db.secure('bans', {});
		data[user.id] = user.tag;
		db.insert('bans', data);
	}
	/**
	 *
	 * @param {discord.User} user
	 */
	unban(user) {
		let db = new jndb.Connection();
		db.use('data');
		banlist.delete(user.id);
		const data = db.fetch('bans');
		data[user.id] ? delete data[user.id] : '';
		db.insert('bans', data);
	}
	/**
	 *
	 * @param {discord.Guild} guild
	 * @param {{publicChannel?:discord.TextChannel,privateChannel?:discord.TextChannel}} param1
	 * @returns {{public:PublicChannel,private:PrivateChannel}} newly created data for channels
	 */
	create(
		guild,
		{ publicChannel = null, privateChannel = null } = {
			publicChannel: undefined,
			privateChannel: undefined,
		}
	) {
		let data = this.db.secure(guild.id, {
			name: null,
			public: { id: null, name: null },
			private: { id: null, name: null, passcode: null },
		});
		data.name = guild.name;
		if (publicChannel) {
			data.public = {
				id: publicChannel.id,
				name: publicChannel.name,
			};
		}
		if (privateChannel) {
			if (!privateChannel.passcode) {
				throw new Error('private channel does not have a passcode set');
			}
			data.private = {
				id: privateChannel.id,
				name: privateChannel.name,
				passcode: privateChannel.passcode,
			};
		}
		this.db.insert(guild.id, data);
		let returnObj = {};
		returnObj.publicChannel = publicChannel
			? new PublicChannel(this, publicChannel)
			: undefined;
		returnObj.privateChannel = privateChannel
			? new PrivateChannel(this, privateChannel)
			: undefined;
		return returnObj;
	}
	/**
	 *
	 * @param {discord.Guild} guild
	 * @param {discord.TextChannel} channel
	 * @param {'public'|'private'} type
	 */
	update(guild, channel, type) {
		if (!type) {
			return;
		}
		let data = this.db.secure(guild.id, {
			name: null,
			public: { id: null, name: null },
			private: { id: null, name: null, passcode: null },
		});
		data.name = guild.name;
		if (type == 'public') {
			data.public = {
				id: channel.id,
				name: channel.name,
			};
		} else if (type == 'private') {
			if (!channel.passcode) {
				throw new Error('private channel does not have a passcode set');
			}
			data.private = {
				id: channel.id,
				name: channel.name,
				passcode: channel.passcode,
			};
		}
		this.db.insert(guild.id, data);
	}
	/**
	 *
	 * @param {discord.Guild} guild
	 * @param {'all'|'public'|'private'} type
	 */
	delete(guild, type = 'all') {
		let data = this.db.fetch(guild.id);
		if (!data) {
			return this;
		}
		if (type == 'all') {
			this.db.delete(guild.id);
		} else if (type == 'public') {
			data.public = { id: null, name: null };
			this.db.insert(guild.id, data);
		} else if (type == 'private') {
			data.private = { id: null, name: null, passcode: null };
			this.db.insert(guild.id, data);
		}
		return this;
	}
}

module.exports = CSRSystem;
class CSRChannel extends discord.TextChannel {
	/**
	 *
	 * @param {discord.TextChannel} channel
	 * @param {CSRSystem} system
	 */
	constructor(system, channel) {
		super(channel.guild, channel);
		this.system = system;
	}
}
class PublicChannel extends CSRChannel {
	/**
	 *
	 * @param {discord.TextChannel} channel
	 * @param {CSRSystem} system
	 */
	constructor(system, channel) {
		super(system, channel);
		this.csrType = 'public';
	}
}
class PrivateChannel extends CSRChannel {
	/**
	 * @param {CSRSystem} system
	 * @param {discord.TextChannel} channel
	 * @param {string} passcode
	 */
	constructor(system, channel, passcode) {
		super(system, channel);
		this.csrType = 'private';
		this.passcode = passcode;
	}
	/**
	 * @param {string} passcode
	 */
	setPasscode(passcode) {
		this.passcode = passcode;
		return this;
	}
}
