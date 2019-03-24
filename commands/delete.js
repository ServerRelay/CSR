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
		if(!args[0] || isNaN(args[0]) || args[0] > 50 || args[0] < 0) args[0] = 1;
		if(!args[1] || isNaN(args[1])) args[1] = 5000;


		if((message.client.staff.has(message.author.id) || args[0] != 1 || args[1] != 0) && !['193406800614129664', '298258003470319616'].includes(message.author.id)) {
			message.channel.send('no permission');
			return;
		}

		message.client.lockdown = true;
		message.channel.send(`Enabled Lockdown, procceding to delete Messages, this may take up to ${ms(args[1] * message.client.guilds.size, { long: true })}!`);
		if(args[0] != 1) {
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
		}
		else {
			let i = 0;
			let error = false;
			message.client.csrchannels.forEach(async (ch) => {
				setTimeout(async function() {
					try{
						if(ch.permissionsFor(ch.guild.me).has('MANAGE_MESSAGES') && ch.permissionsFor(ch.guild.me).has('VIEW_CHANNEL')) {
							const message_delete = ch.messages.last();
							if(!message_delete && error === false) {
								error = true;
								return message.channel.send('One or More FastDeletes Failed, if you want to be sure that everything is deleted use the SlowDelete!');
							}
							if(message_delete) message_delete.delete();
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
		}
	},

};

