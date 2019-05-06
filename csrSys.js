const discord = require('discord.js');
class CSRSystem {
	/**
	 *
	 * @param {discord.Client} client
	 */
	constructor(client) {
		this.client = client;
	}
	/**
	 *
	 * @readonly
	 * @returns {Map<string,discord.TextChannel}
	 */
	get channels() {
		const chs = new Map();
		this.client.guilds.forEach(guild => {
			const channel = guild.channels.find(
				x => x.type == 'text' && x.name == 'irc'
			);
			if (channel) {
				chs.set(guild.id, channel);
			}
		});
		return chs;
	}
	/**
	 *
	 * @param {string|discord.RichEmbed} message
	 */
	sendAll(message) {
		const channels = this.channels;
		channels.forEach(ch => {
			ch.send(message).catch(e => {
				console.log('error sending message in sendAll:\n' + e);
			});
		});
	}
}
