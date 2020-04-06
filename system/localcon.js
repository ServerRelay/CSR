const fs = require('fs');
const path = require('path');
const _writeFile = Symbol('writefile');
class LocalConnection {
	/**
	 * @param {string} filepath
	 */
	constructor(filepath) {
		this.path = path.resolve(filepath);

		if (!fs.existsSync(this['path'])) {
			fs.writeFileSync(this['path'], JSON.stringify({}, null, '\t'));
		}
		this._data = fs.readFileSync(this.path);
		return this;
	}
	[Symbol.iterator]() {
		// get the properties of the object
		const props = this.fetchAll();
		const properties = Object.keys(props);
		let count = 0;
		// set to true when the loop is done
		let isDone = false;

		// define the next method, need for iterator
		const next = () => {
			// control on last property reach
			if (count >= properties.length) {
				isDone = true;
			}
			return { done: isDone, value: props[properties[count++]] };
		};

		// return the next method used to iterate
		return { next };
	}

	save() {
		this[_writeFile](this._data);
	}
	refresh(){
		this._data=fs.readFileSync(this.path)
	}
	/**
	 *	deletes a key from the database
	 * @param {string|number} key
	 * @returns {this}
	 */
	delete(key) {
		let data = this._data;
		if (typeof key == 'string') {
			let keys = key.split('.');
			let len = keys.length;
			for (let i = 0; i < len - 1; i++) {
				let elem = keys[i];
				if (!data[elem]) data[elem] = {};
				data = data[elem];
			}
			delete data[keys[len - 1]];
		} else {
			delete data[key];
		}
		return this;
	}
	/**
	 * checks if the database has a value
	 * @param {string|number} key
	 * @returns {boolean}
	 */
	has(key) {
		let data = copyObject(this._data);
		if (typeof key == 'string') {
			let keys = key.split('.');
			for (let i of keys) {
				if (data[i] == undefined) return false;
				data = data[i];
			}
			return true;
		} else {
			return data[key] ? true : false;
		}
	}
	/**
	 * insert a value into the database
	 * @param {string|number} key
	 * @param {*} value
	 * @returns {this}
	 */
	insert(key, value) {
		let data = this._data;
		//console.log(data);
		if (typeof key == 'string') {
			let keys = key.split('.');
			let len = keys.length;
			for (let i = 0; i < len - 1; i++) {
				let elem = keys[i];
				if (!data[elem]) data[elem] = {};
				data = data[elem];
			}
			data[keys[len - 1]] = value;
			//console.log(this._data);
		} else {
			data[key] = value;
		
		}
		return this;
	}
	/**
	 * fetch a value from the database and adds it to this.
	 * @param {string|number} key
	 * @returns {*}
	 */
	fetch(key) {
		return this._getFromKey(key);
	}
	/**
	 * fetch all table objects from the database directly and inserts  them into an array in the form of:`[ { key:string|number,value:any } ]`
	 * @returns {Array<{[key:string]:any}>}
	 */
	fetchArray() {
		const arr = [];
		let data = this._data
		for (const i in data) {
			arr.push({ [i]: data[i] });
		}
		return arr;
	}
	/**
	 * fetch all table objects from the database directly
	 * @returns {{[key:string]:any}}
	 * @memberof JNDBClient
	 */
	fetchAll() {
		
		let data = this._data
		// for(const i in data[this['table']]) {
		// this[i] = data[this['table']][i];
		// }
		return data;
	}
	/**
	 * short-hand helper for `if(!key){Connection.insert(key,value); Connection.get(key)}`
	 * @template T
	 * @param {string|number} key
	 * @param {T} defaultValue
	 * @returns {T}
	 * @example
	 * let db=new jndb.Connection('users')
	 * let value=db.secure('user1',{})
	 * console.log(value)// {}
	 *
	 */
	secure(key, defaultValue) {

		const oldVal = this.fetch(key);
		if (!oldVal) {
			this.insert(key, defaultValue);
			return defaultValue;
		}
		return oldVal;
	}
	/**
	 *
	 * @param {(value:any,key:string|number)=>boolean} fn
	 */
	locate(fn) {
		let res = [];
		let values = this.fetchAll();
		for (let i in values) {
			if (fn(values[i], i)) {
				res.push({ key: i, value: values[i] });
			}
		}
		return res;
	}

	[_writeFile](data) {
		fs.writeFileSync(this.path, JSON.stringify(data, null, '\t'));
	}
	_getFromKey(key) {
		let data = copyObject(this._data);
		if (typeof key == 'string') {
			let keys = key.split('.');
			for (let i of keys) {
				data = data[i];
			}
			return data;
		} else {
			return data[key];
		}
	}
	_getFromKeyRef(key) {
		let data = this._data;
		if (typeof key == 'string') {
			let keys = key.split('.');
			let len = keys.length;
			for (let i = 0; i < len - 1; i++) {
				let elem = keys[i];
				if (!data[elem]) data[elem] = {};
				data = data[elem];
			}
			return data[keys[len - 1]];
		} else {
			return data[key];
		}
	}
}

//x.save()
function copyObject(obj) {
	return JSON.parse(JSON.stringify(obj));
}
module.exports=LocalConnection