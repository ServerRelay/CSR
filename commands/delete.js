const { staff } = require('./stafflist.json');
// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js');

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
		if(!args[0] || isNaN(args[0]) || args[0] > 50 || args[0] < 0) args[5] = 5;


		if(staff.findIndex(x=>x === message.author.id) == -1) {
			message.channel.send('no permission');
			return;
		}

		let i = 0;
		message.client.csrchannels.forEach(async (ch) => {
			setTimeout(async function deleteMSG() {
				try{
					if(ch.permissionsFor(ch.guild.me).has('MANAGE_MESSAGES')) {ch.bulkDelete(args[0], true);}
					else {ch.send('COULD NOT DELETE LAST MESSAGES BECAUSE I DO NOT HAVE PERMS!');}
				}
				catch(e) {
					console.log(e.name + '[]' + e.message);
				}

			}, i * 5000);
			i++;
		});
	},

};

