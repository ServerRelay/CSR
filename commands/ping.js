const { Command } = require('easy-djs-commandhandler');
module.exports = new Command({ name: 'ping' }).execute((client, message) => {
	message.channel
		.send('ping')
		.then(m =>
			m.edit(
				`Pong! Latency is ${m.createdTimestamp -
					message.createdTimestamp}ms. API Latency is ${Math.round(
					message.client.ping
				)}ms`
			)
		);
});
