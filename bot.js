const discord = require('discord.js');
const CSRSystem = require('./csrSys');
const jndb = require('jndb');
/**
 *
 *
 * @class Bot
 * @extends {discord.Client}
 */
class Bot extends discord.Client {
	/**
	 *
	 * @param {discord.ClientOptions} [options]
	 */
	constructor(options) {
		super(options);
		this.db = new jndb.Connection();
		this.system = new CSRSystem(this, process.env.channel);
		/**
		 * @type {discord.Collection<string,string>}
		 */
		this.banlist = new discord.Collection();
		this.lockdown = {
			enabled: false,
			time: 0,
		};
		/**
		 * @type {discord.Collection<string,string>}
		 */
		this.csrCooldowns = new discord.Collection();

		/**
		 * @type {string[]}
		 */
		this.filter = [];
	}
	/**
	 * @returns {Map<string,string>}
	 */
	get staff() {
		let map = new Map();
		this.db.use('staff');
		let staff = this.db.fetchAll();
		for (let i in staff) {
			map.set(i, staff[i]);
		}
		return map;
	}
	/**
	 * @returns {Map<string,{tag:string,color:number[]}}
	 */
	get customColors() {
		this.db.use('data');
		let colors = this.db.secure('custom_colors', {});
		let map = new Map();
		for (let i in colors) {
			map.set(i, colors[i]);
		}
		return map;
	}
	/**
	 *
	 *
	 * @param {discord.Guild} guild
	 * @returns
	 * @memberof Bot
	 */
	getPublicChannel(guild) {
		return this.system.channels.get(guild.id);
	}
	/**
	 *
	 *
	 * @param {discord.Guild} guild
	 * @returns
	 * @memberof Bot
	 */
	getPrivateChannel(guild) {
		return this.system.privateChannels.get(guild.id);
	}
}
module.exports = Bot;
