const { Command } = require('easy-djs-commandhandler');
const servers = new Command({
	name: 'servers',
	description: 'sends the amount of servers',
});
module.exports = servers.execute((client, message) => {
	if (message.author.id === '298258003470319616') {
		let st = 0;
		message.client.guilds.forEach(sv => {
			st = st + sv.memberCount;
		});

		message.author.send(
			`\`\`\`md\n${
				message.client.guilds.size
			}\n <total servers>\n${st}\n <total users/members>\`\`\``
		);
	}
	else {
		message.author.send(
			`\`\`\`md\n${message.client.guilds.size}\n <total servers>\`\`\``
		);
	}
});
