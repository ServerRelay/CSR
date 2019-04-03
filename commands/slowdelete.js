// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'slowdelete',
	staff:'f',
	/**
     *
     *
     * @param {Message} message
     * @param {Array} args
     * @returns
     */
	async execute(message, args) {
		if(!args[0] || isNaN(args[0])) args[0] = 50;
		if(!args[1] || isNaN(args[1])) args[1] = 5000;


		if(!['193406800614129664', '298258003470319616'].includes(message.author.id)) {
			message.channel.send('no permission');
			return;
		}

		message.client.lockdown = true;
		message.channel.send(`Enabled Lockdown, procceding to delete Messages, this may take up to ${ms(args[1] * message.client.guilds.size, { long: true })}!`);
		const warner = `Deleting Last Messages, this might take up to ${ms(args[1] * message.client.guilds.size, { long: true })}!`;
		let i = 0;
		message.client.csrchannels.forEach((ch) => {
			ch.send(warner);
		});
		message.client.csrchannels.forEach(async (ch) => {
			setTimeout(async function() {
				try{
					if(ch.permissionsFor(ch.guild.me).has('MANAGE_MESSAGES') && ch.permissionsFor(ch.guild.me).has('VIEW_CHANNEL')) {
						const messages = await ch.fetchMessages({ limit: args[0] }).then(msg => msg.filter(m => m.author.id == message.client.user.id && m.content != warner));
						if(!messages.size) return console.log('Skipping');
						await ch.bulkDelete(messages, true);
					}
					else if(ch.permissionsFor(ch.guild.me).has('VIEW_CHANNEL')) {
						ch.send('COULD NOT DELETE LAST MESSAGES BECAUSE I DO NOT HAVE PERMS!');
					}
				}
				catch(e) {
					console.log(e);
				}

			}, i * args[1]);
			i++;
		});
		console.log(i);


	},

};

