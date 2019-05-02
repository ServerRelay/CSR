const discord = require('discord.js');
const code = require('./ircrules');

/**
 *
 * @param {discord.Client} client
 * @returns {discord.RichEmbed}
 */
function insertRules(client) {
	const cd = new discord.RichEmbed()
		.setColor([0, 200, 138])
		.setDescription(code)
		.setFooter('IRC Code Of Conduct', client.user.displayAvatarURL);
	return cd;
}

function loadStaff() {
	const { staff } = require('./commands/stafflist.json');
	const arr = new Map();
	for(const i of staff) {
		arr.set(i, '');
	}
	return arr;
}
/**
 *
 * @param {discord.Guild} guild
 */
function getChannel(guild) {
	const channel = guild.channels.find(x=>x.type == 'text' && x.name == 'irc');
	return channel || undefined;
}
exports.insertRules = insertRules;
exports.loadStaff = loadStaff;
exports.getChannel = getChannel;