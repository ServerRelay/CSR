const fs = require('fs');
const path = require('path');

/**
 *
 * @param {'path-like'} file
 */
function load(file) {
	let data;
	try{
		data = fs.readFileSync(path.resolve(file));
	}
	catch(e) {
		return;
	}
	data = data.toString();
	data = data.replace('\r', '');
	data = data.split('\n');
	for(const i of data) {
		const vals = i.split('=');
		process.env[vals[0]] = vals[1].replace(/[\n\r]/g, '');
	}
}
exports.load = load;
