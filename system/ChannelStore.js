const { ConnectionStore } = require('./DBStore');
const { PublicChannel, PrivateChannel } = require('./structures');
class ChannelStore extends ConnectionStore {
	/**
	 *
	 * @param {import('./')} system
	 */
	constructor(system) {
		let path = './db.json';
		super(path);
		this.system = system;
		this.client = system.client;
		/**
		 * @type {Map<string,{public:PublicChannel,private:PrivateChannel}>}
		 */
		this.container = new Map();
	}
	init() {
		let channels = super.get('channels');
		for (let i in channels) {
			let obj = {
				public: undefined,
				private: undefined,
			};
			let guild = this.client.guilds.get(i);
			if (!guild) {
				super.delete(i);
				continue;
			}
			if (channels[i].public.id) {
				/**
				 * @type {import('discord.js').TextChannel}
				 */
				// @ts-ignore
				let channel = guild.channels.get(channels[i].public.id);
				if (!channel) {
					continue;
				}
			}
			obj.public = new PublicChannel(this.system, channel);
			if (channels[i].private.id) {
				/**
				 * @type {import('discord.js').TextChannel}
				 */
				// @ts-ignore
				let channel = guild.channels.get(channels[i].private.id);
				if (!channel) {
					continue;
				}
				channel.passcode = channels[i].private.passcode;
				obj.private = new PrivateChannel(
					this.system,
					channel,
					channel.passcode
				);
			}
			this.container.set();
		}
	}
	get public() {
		/**
		 * @type {Map<string,PublicChannel>}
		 */
		let map = new Map();
		this.container.forEach((channels, gid) => {
			if (!channels.public) return;
			map.set(gid, channels.public);
		});
	}
	/**
	 * @returns {Map<string,PrivateChannel>}
	 */
	get private() {
		/**
		 * @type {Map<string,PrivateChannel>}
		 */
		let map = new Map();
		this.container.forEach((channels, gid) => {
			if (!channels.private) return;
			map.set(gid, channels.private);
		});
	}
	/**
	 *
	 * @param {import('discord.js').Guild} guild
	 * @param {{publicChannel?:import('discord.js').TextChannel,privateChannel?:import('discord.js').TextChannel}} param1
	 * @returns {{publicChannel:PublicChannel,privateChannel:PrivateChannel}} newly created data for channels
	 */
	set(
		guild,
		{ publicChannel, privateChannel } = {
			publicChannel: undefined,
			privateChannel: undefined,
		}
	) {
		let data = super.get(guild.id) || {
			name: null,
			public: { id: null, name: null },
			private: { id: null, name: null, passcode: null },
		};
		data.name = guild.name;
		if (publicChannel) {
			data.public = {
				id: publicChannel.id,
				name: publicChannel.name,
			};
		}
		if (privateChannel) {
			if (privateChannel.passcode === undefined) {
				throw new Error('private channel does not have a passcode set');
			}
			data.private = {
				id: privateChannel.id,
				name: privateChannel.name,
				passcode: privateChannel.passcode,
			};
		}
		super.set(`channels.${guild.id}`, data);
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

		this.container.set(guild.id, returnObj);
		return returnObj;
	}
	
	/**
	 *
	 * @param {import('discord.js').Guild} guild
	 * @param {'all'|'public'|'private'} type
	 */
	delete(guild, type = 'all') {
		let data = super.get(guild.id);
		if (!data) {
			return this;
		}
		if (type == 'all') {
			super.delete(guild.id);
		} else if (type == 'public') {
			data.public = { id: null, name: null };
			super.set(guild.id, data);
		} else if (type == 'private') {
			data.private = { id: null, name: null, passcode: null };
			super.set(guild.id, data);
		}
		return this;
	}
}
module.exports = ChannelStore;
