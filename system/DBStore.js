const Base = require('./BaseStore');
const jndb = require('jndb');
const path = require('path');
const LocalConnection = require('./localcon');
class DBStore extends Base {
	/**
	 * 
	 * @param {string} filepath 
	 */
	constructor(filepath) {
		super();
		let filePath = path.dirname(filepath);
		let fileName = path.basename(filepath);
		this._db = new jndb.Connection({ path: filePath, fileName });
	}
	/**
	 * 
	 * @param {string|number} key 
	 * @param {*} value 
	 */
	set(key, value) {
		this._db.insert(key, value);
	}
	/**
	 * 
	 * @param {string|number} key 
	 */
	get(key) {
		return this._db.fetch(key);
	}
	getAll() {
		return this._db.fetchAll();
	}
	/**
	 * 
	 * @param {string|number} key 
	 */
	delete(key) {
		this._db.delete(key);
	}

	find(fn) {
		return this._db.locate(fn);
	}
}
class ConnectionStore extends Base {
	constructor(filepath) {
		super();
		this.path = filepath;
		this._db = new LocalConnection(filepath);
	}
	set(key, value) {
		this._db.insert(key, value);
		this._db.save();
	}
	get(key) {
		return this._db.fetch(key);
	}
	getAll() {
		return this._db.fetchAll();
	}
	delete(key) {
		this._db.delete(key);
		this._db.save();
	}
	/**
	 *
	 * @param {(value:any,key:string|number)=>boolean} fn
	 */
	find(fn) {
		return this._db.locate(fn);
	}
	refresh() {
		this._db.refresh();
	}
	has(key) {
		return this._db.has(key);
	}
}
module.exports = { ConnectionStore, DBStore };
