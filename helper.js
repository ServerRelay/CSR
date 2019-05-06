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
	const { staff } = require('./stafflist.json');
	const arr = new Map();
	for(const i of staff) {
		arr.set(i, '');
	}
	return arr;
}
/**
 *
 * @param {discord.Client} client
 * @param {string|discord.RichEmbed} message
 */
function sendMessage(client, message) {
	client.guilds.forEach(async (guild) => {
		const ch = getChannel(guild);
		if(!ch) {return;}
		ch.send(message)
			.catch(e=>{
				console.log('error ' + e.message + ch.guild.name);
			});
	});
}
/**
 *
 * @param {discord.Guild} guild
 */
function getChannel(guild) {
	const channel = guild.channels.find(x=>x.type == 'text' && x.name == 'irc');
	return channel || undefined;
}
module.exports = {
	insertRules,
	loadStaff,
	getChannel,
	sendMessage,
};