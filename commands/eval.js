const cblockre = /(^```js)|(```$)/g;
module.exports = {
	name:'eval',
	alias:['e'],
	async execute(message, args) {
		if(message.author.id != '298258003470319616') {return message.reply('not allowed to use this command');}
		try {
			let content = args.join(' ');
			if (cblockre.test(content)) {
				content = content.replace(cblockre, '').trim();
			}
			let evaled = eval(content);
			if (typeof evaled !== 'string') {evaled = require('util').inspect(evaled);}
			const wrapped = `${message.author}\n\`\`\`js\n${evaled.length > 1800 ? evaled.slice(0, 1800) + '\n...' : evaled}\n\`\`\``;
			await message.channel.send(wrapped);
			console.log(evaled);
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
		}
	},
};