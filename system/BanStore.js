const { ConnectionStore } = require('./DBStore');
class BanStore extends ConnectionStore {
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
		 * @type {Map<string, BanInfo>}
		 */
		this.bans = new Map();
	}
	init() {
		let bans = super.get('bans');
		for (let i in bans) {
			this.bans.set(i, bans[i]);
		}
	}
	/**
	 *
	 * @param {string} id
	 */
	get(id) {
		return { id, info: this.bans.get(id) };
	}
	/**
	 *
	 * @param {import('discord.js').User} user
	 */
	add(user) {
		let info = {
			tag: user.tag,
			banned_at: getFormattedDate(),
		};
		this.bans.set(user.id, info);
		super.set(`bans.${user.id}`, info);
		return this;
	}
	/**
	 *
	 * @param {string} id
	 */
	delete(id) {
		this.bans.delete(id);
		super.delete(`bans.${id}`);
		return this;
	}
	/**
	 *
	 * @param {string} id
	 */
	has(id) {
		return this.bans.has(id);
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
 * @param {Map} map
 */
function toObject(map) {
	let obj = {};
	map.forEach((element, key) => {
		obj[key] = element;
	});
	return obj;
}
/**
 * @typedef {Object} BanInfo
 * @property {string} tag
 * @property {string} banned_at
 */
module.exports = BanStore;
