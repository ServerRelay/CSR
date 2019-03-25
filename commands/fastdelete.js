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


		if(!message.client.staff.has(message.author.id)) {
			message.channel.send('no permission');
			return;
		}

		message.channel.send('Fast Delete engaged starting to delete!');

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

	},

};

