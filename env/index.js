const fs = require('fs');
const path = require('path');

/**
 *
 * @param {string} file
 */
function load(file) {
	let data;
	try {
		data = fs.readFileSync(path.resolve(file));
	} catch (e) {
		return;
	}
	data = data.toString();
	data = data.replace(/\r/g, '');
	data = data.split('\n');
	for (const i of data) {
		const vals = i.split('=');
		process.env[vals.shift()] = vals.join('=');
	}
}
exports.load = load;
