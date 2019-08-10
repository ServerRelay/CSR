const discord = require('discord.js');
const System = require('./system/index');
const jndb = require('jndb');
const fs = require('fs');
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
		this.system = new System(this);
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
		this.prefixDB=new jndb.Connection({fileName:'prefixes.json'})
		this.prefixDB.use('prefixes')
	}
	/**
	 * @returns {Map<string,string>}
	 */
	get staff() {
		const map = new Map();
		this.db.use('staff');
		const staff = this.db.fetchAll();
		for (const i in staff) {
			map.set(i, staff[i]);
		}
		return map;
	}
	/**
	 * @returns {discord.RichEmbed}
	 */
	get rules() {
		const code = require('./ircrules');
		const cd = new discord.RichEmbed()
			.setColor([0, 200, 138])
			.setDescription(code)
			// @ts-ignore
			.setFooter('IRC Code Of Conduct', this.user.displayAvatarURL);
		return cd;
	}
	backup() {
		// fs.createReadStream('jndb.json').pipe(
		//	fs.createWriteStream('jndbBackup.json')
		// );
		fs.copyFileSync('jndb.json', 'jndbBackup.json');
	}
}
module.exports = Bot;
