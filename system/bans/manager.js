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
	 * @returns {{[id:string]:BanInfo}}
	 */
	get bans() {
		return this.db.fetch('bans');
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
	 * @param {string} id
	 * @param {string} tag
	 */
	set(id, tag) {
		let bans = this.bans;
		let info = {
			tag,
			banned_at: getFormattedDate(),
		};
		bans[id] = info;
		this.db.insert('bans', info);
		if (this.client.banlist) {
			this.client.banlist.set(id, info);
		}
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
		if (this.client.banlist) {
			this.client.banlist.delete(id);
		}
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
