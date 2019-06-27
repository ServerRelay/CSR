const { Command } = require('easy-djs-commandhandler');
const dmap = require('dmap-postgres');
const Filter = new Command({
	name: 'filter',
	description: 'adds, deletes or clears the filter, flags are `add`, `remove`, `clear`',
	requires: ['botowner'],
	hideinhelp:true,
});
module.exports = Filter.execute(async (client, message, args) => {
	let flag = args[0];
	args.splice(0,1)
	let restrictee = args.join(' ');
	let db = new dmap('filter', {
		connectionString: process.env.DATABASE_URL,
		ssl: true,
	});
	await db.connect();
	if (flag == 'add') {
		client.filter.push(restrictee);
		message.channel.send(`added \`${restrictee}\` to the filter`);
	} else if (flag == 'remove') {
		let index = client.filter.findIndex((x) => x == restrictee);
		if (!index) {
			return message.channel.send('word/phrase doesnt exist');
		}
		client.filter.splice(index, 1);
		message.channel.send(`removed \`${restrictee}\` from the filter`);
	} else if (flag == 'clear') {
		client.filter.splice(0);
		message.channel.send('cleared filter list');
	}
	await db.set('words', client.filter);
	await db.end();
});
