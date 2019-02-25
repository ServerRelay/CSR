module.exports = {
	name: 'ping',
	description: 'gets ping ms of bot and api',
	execute(message) {
		message.channel.send('ping')
			.then(
				m=>m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ping)}ms`)
			);
	},
};