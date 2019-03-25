// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js');
const ms = require('ms');

const warner = 'Deleting Last Messages, this might take a while!';
module.exports = {
	name: 'fastdelete',
	/**
     *
     *
     * @param {Message} message
     * @param {*} args
     * @returns
     */
	async execute(message, args) {
		if(!args[0] || isNaN(args[0]) || args[0] > 3 || args[0] < 0) args[0] = 1;
		if(!args[1] || isNaN(args[1])) args[1] = 100;


		if(!message.client.staff.has(message.author.id)) {
			message.channel.send('no permission');
			return;
		}

		message.channel.send('Fast Delete engaged starting to delete!');
		if(args[0] == 1) {
			let error = false;
			message.client.csrchannels.forEach(async (ch) => {
				try{
					if(ch.permissionsFor(ch.guild.me).has('MANAGE_MESSAGES') && ch.permissionsFor(ch.guild.me).has('VIEW_CHANNEL')) {
						const message_delete = ch.messages.last();
						if(!message_delete && error === false) {
							error = true;
							return message.channel.send('One or More FastDeletes Failed, if you want to be sure that everything is deleted use the SlowDelete!');
						}
						if(message_delete) message_delete.delete().catch(console.error);
					}
					else if(ch.permissionsFor(ch.guild.me).has('VIEW_CHANNEL')) {
						ch.send('COULD NOT DELETE LAST MESSAGES BECAUSE I DO NOT HAVE PERMS!');
					}
				}
				catch(e) {
					console.log(e);
				}
			});
		}
		else if (args[0] <= 3) {
			let i = 0;
			let error = false;
			message.client.csrchannels.forEach(async (ch) => {
				try{
					if(ch.permissionsFor(ch.guild.me).has('MANAGE_MESSAGES') && ch.permissionsFor(ch.guild.me).has('VIEW_CHANNEL')) {
						const messages_delete = ch.messages.last(3);
						messages_delete.forEach(message_delete => {
							if(!message_delete && error === false) {
								error = true;
								return message.channel.send('One or More FastDeletes Failed, if you want to be sure that everything is deleted use the SlowDelete!');
							}
							if(message_delete) {
								setTimeout(async function() {
									message_delete.delete().catch(console.error);

								}, i * args[1]);
								i++;
							}
						});
					}
					else if(ch.permissionsFor(ch.guild.me).has('VIEW_CHANNEL')) {
						ch.send('COULD NOT DELETE LAST MESSAGES BECAUSE I DO NOT HAVE PERMS!');
					}
				}
				catch(e) {
					console.log(e);
				}

			});
		}
	},

};

