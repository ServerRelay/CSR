const { Command } = require('easy-djs-commandhandler');
const Stats = new Command({
	name: 'servernames',
	description: '(owner) fetch all server names',
	requires: ['botowner'],
	aliases: ['stats'],
	hideinhelp: true,
});
module.exports = Stats.execute((client, message) => {
	let st = 0;
	message.client.guilds.forEach((sv) => {
		st = st + sv.memberCount;
	});

	message.author.send(
		`\`\`\`md\n${
			message.client.guilds.size
		}\n <total servers>\n${st}\n <total users/members>\`\`\``
	);
});
