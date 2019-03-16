const { staff } = require('./stafflist.json');
// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js');
const ms = require('ms');

const warner = 'Deleting Last Messages, this might take a while!';
module.exports = {
	name: 'delete',
	/**
     *
     *
     * @param {Message} message
     * @param {*} args
     * @returns
     */
	async execute(message, args) {
		if(!args[0] || isNaN(args[0]) || args[0] > 50 || args[0] < 0) args[0] = 5;
		if(!args[1] || isNaN(args[1]) || args[1] < 5000) args[1] = 5000;


		/* 	if(staff.findIndex(x=>x === message.author.id) == -1) {
			message.channel.send('no permission');
			return;
		}
        */
		if(!['193406800614129664', '298258003470319616'].includes(message.author.id)) return message.reply('No Permission!');

		message.client.lockdown = true;
		message.channel.send(`Enabled Lockdown, procceding to delete Messages, this may take up to ${ms(args[1] * message.client.guilds.size, { long: true })}!`);
		let i = 0;
		message.client.csrchannels.forEach((ch) => {
			ch.send(warner);
		});
		await message.client.csrchannels.forEach(async (ch) => {
			await setTimeout(async function() {
				try{
					if(ch.permissionsFor(ch.guild.me).has('MANAGE_MESSAGES') && ch.permissionsFor(ch.guild.me).has('VIEW_CHANNEL')) {
						const messages = await message.channel.fetchMessages({ limit: args[0] }).then(msg => msg.filter(m => m.author.id == message.client.user.id && m.content != warner));
						await ch.bulkDelete(messages, true);
					}
					else if(ch.permissionsFor(ch.guild.me).has('VIEW_CHANNEL')) {
						ch.send('COULD NOT DELETE LAST MESSAGES BECAUSE I DO NOT HAVE PERMS!');
					}
				}
				catch(e) {
					console.log(e.name + '[]' + e.message);
				}

			}, i * args[1]);
			i++;
		});
		await console.log(i);
	},

};

