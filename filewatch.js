const fs = require('fs');
const path = require('path');
class FileWatch {
	/**
	 *
	 * @param {import('./bot')} client
	 */
	constructor() {
		this.watching = new Map();
	}
	/**
	 *
	 * @param {string} folder
	 * @param {(event:string,file:string)=>void} callback
	 */
	watch(folder, callback) {
		let fsWait = false;
		if (!this.watching.has(folder)) {
			this.watching.set(folder, { last_changed: Date.now() });
		}
		const fldr = this.watching.get(folder);
		fs.watch(path.resolve(folder),{recursive:true}, (event, file) => {
			if (fsWait) return;
			fldr.last_changed = Date.now();
			this.watching.set(folder, fldr);
			callback(event, file);
			fsWait = true
			setTimeout(() => {
				fsWait = false;
			}, 1000);
		});
	}
}
function reloadCommands(client, folder) {
	folder = path.resolve(folder);
	const commandFiles = fs
		.readdirSync(folder)
		.filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		delete require.cache[require.resolve(`${folder}/${file}`)];
		try {
			const command = require(`${folder}/${file}`);
			client.commands.delete(command.help.name);
			client.commands.set(command.help.name, command);
		} catch (err) {
			console.log(err);
		}
	}
}
module.exports = FileWatch;
