const jndb = require('jndb');
class BansManager {
	/**
	 * @param {import('../../bot')} client
	 */
	constructor(client) {
		this.client = client;
		this.db = new jndb.Connection();
		this.db.use('data');
	}
	/**
	 * @returns {Map<string,BanInfo>}
	 */
	get bans() {
		let map=new Map()
		let bans=this.db.fetch('bans')
		for(let i in bans){
			map.set(i,bans[i])
		}
		return map;
	}
	/**
	 *
	 * @param {string} id
	 */
	get(id) {
		return { id, info: this.bans[id] };
	}
	/**
	 *
	 * @param {import('discord.js').User} user
	 */
	set(user) {
		let bans = this.bans;
		let info = {
			tag:user.tag,
			banned_at: getFormattedDate(),
		};
		bans[user.id] = info;
		this.db.insert('bans', info);
		return this;
	}
	/**
	 *
	 * @param {string} id
	 */
	delete(id) {
		let bans = this.bans;
		delete bans[id];
		this.db.insert('bans', bans);
		return this;
	}
	/**
	 *
	 * @param {string} id
	 */
	has(id) {
		return this.bans[id] ? true : false;
	}
}
function getFormattedDate() {
	let d = new Date(),
		dformat =
			[d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') +
			' ' +
			[d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
	return dformat;
}

/**
 * @typedef {Object} BanInfo
 * @property {string} tag
 * @property {string} banned_at
 */
module.exports = BansManager;
