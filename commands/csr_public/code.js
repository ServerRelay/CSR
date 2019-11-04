const { Command } = require('easy-djs-commandhandler');
const code = new Command({ name: 'code', aliases: ['rules'] });
module.exports = code.execute((client, message) => {
	message.channel.send(client.rules);
});
