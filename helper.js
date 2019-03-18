const discord = require('discord.js');
const code = require('./commands/code');

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


exports.insertRules = insertRules;