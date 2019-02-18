module.exports = {
	name: 'servers',
	description: 'sends list of total ammount of servers',
	execute(message) {
		if(message.author.id === '298258003470319616') {
			let st = 0;
			message.client.guilds.forEach(sv => {
				st = st + sv.memberCount;
			});

			message.author.send(`\`\`\`md\n${message.client.guilds.size}\n <total servers>\n${st}\n <total users/members>\`\`\``);

		}
		else{
			message.author.send(`\`\`\`md\n${message.client.guilds.size}\n <total servers>\`\`\``);


		}

	},
};