const { TextChannel, User } = require('discord.js');
const system = require('./main');
class BaseChannel extends TextChannel {
	/**
	 *
	 * @param {TextChannel} channel
	 * @param {system} system
	 */
	constructor(system, channel) {
		super(channel.guild, channel);
		// @ts-ignore
		this.system = system;
	}
}

class PublicChannel extends BaseChannel {
	/**
	 *
	 * @param {TextChannel} channel
	 * @param {system} system
	 */
	constructor(system, channel) {
		super(system, channel);
		this.csrType = 'public';
		/**
		 * @type {import('discord.js').Collection<string,import('discord.js').Message>}
		 */
		// @ts-ignore
		this.messages = channel.messages;
	}
}
class PrivateChannel extends BaseChannel {
	/**
	 * @param {system} system
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

function getFormattedDate() {
	let d = new Date(),
		dformat =
			[d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') +
			' ' +
			[d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
	return dformat;
}
class BanInfo {
	/**
	 *
	 * @param {User} user
	 */
	constructor(user) {
		this.user = user;
		this.date;
		this.tag = user.tag;
	}
	updateDate() {
		this.date = getFormattedDate();
	}
	/**
	 *
	 * @param {Date} date
	 */
	setDate(date) {
		this.date =
			[date.getMonth() + 1, date.getDate(), date.getFullYear()].join(
				'/'
			) +
			' ' +
			[date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
	}
}
module.exports = {
	PrivateChannel,
	PublicChannel,
	BaseChannel,
	BanInfo
};
