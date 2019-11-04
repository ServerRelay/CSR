const fs = require('fs');
const { Command } = require('easy-djs-commandhandler');
const reload = new Command({ name: 'reload', requires: ['botowner'],hideinhelp:true, });
module.exports = reload.execute((client, message) => {
	if (message.author.id !== '298258003470319616') {
		message.channel.send('NO');
		return;
	}
	let i = 0;
	const commandFiles = fs
		.readdirSync('./commands')
		.filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		delete require.cache[require.resolve(`./${file}`)];
		delete require.cache[require.resolve('./stafflist.json')];
		const command = require(`./${file}`);
		// message.client.commands.delete(command.name)

		message.client.commands.clear();
		setTimeout(() => {
			message.client.commands.set(command.name, command);
		}, 100);
		i += 1;
	}
	message.channel.send('reloaded ' + i + ' files');
});
