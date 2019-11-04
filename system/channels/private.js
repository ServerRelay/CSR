const Base = require('./base');
const { TextChannel } = require('discord.js');
class PrivateChannel extends Base {
	/**
	 * @param {import('../main')} system
	 * @param {TextChannel} channel
	 * @param {string} passcode
	 */
	constructor(system, channel, passcode) {
		super(system, channel);
		this.csrType = 'private';
		this.passcode = passcode;
		this.messages = channel.messages;
	}
	/**
	 * @param {string} passcode
	 */
	setPasscode(passcode) {
		this.passcode = passcode;
		this.system.channels.update(this.guild, this, 'private');
		return this;
	}
}

module.exports = PrivateChannel;
