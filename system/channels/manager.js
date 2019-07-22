const jndb = require('jndb');
const PublicChannel = require('./public');
const PrivateChannel = require('./private');
class ChannelsManager {
	/**
	 *
	 * @param {import('../main')} system
	 */
	constructor(system) {
		this.system = system;
		this.client = system.client;
		this.db = new jndb.Connection();
		this.db.use('channels');
	}
	/**
	 * @returns {Map<string,PublicChannel>}
	 */
	get public() {
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
			/**
			 * @type {import('discord.js').TextChannel}
			 */
			// @ts-ignore
			let channel = guild.channels.get(channels[i].public.id);
			if (!channel) {
				continue;
			}
			chs.set(i, new PublicChannel(this.system, channel));
		}
		return chs;
	}
	/**
	 * @returns {Map<string,PrivateChannel>}
	 */
	get private() {
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
			/**
			 * @type {import('discord.js').TextChannel}
			 */
			// @ts-ignore
			let channel = guild.channels.get(channels[i].private.id);
			if (!channel) {
				continue;
			}
			channel.passcode = channels[i].private.passcode;
			chs.set(
				i,
				new PrivateChannel(this.system, channel, channel.passcode)
			);
		}
		return chs;
	}
	/**
	 *
	 * @param {import('discord.js').Guild} guild
	 * @param {{publicChannel?:import('discord.js').TextChannel,privateChannel?:import('discord.js').TextChannel}} param1
	 * @returns {{publicChannel:PublicChannel,privateChannel:PrivateChannel}} newly created data for channels
	 */
	create(
		guild,
		{ publicChannel, privateChannel } = {
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
			? new PublicChannel(this.system, publicChannel)
			: undefined;
		returnObj.privateChannel = privateChannel
			? new PrivateChannel(
					this.system,
					privateChannel,
					privateChannel.passcode
			  )
			: undefined;
		return returnObj;
	}
	/**
	 *
	 * @param {import('discord.js').Guild} guild
	 * @param {import('discord.js').TextChannel} channel
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
	 * @param {import('discord.js').Guild} guild
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

module.exports = ChannelsManager;
