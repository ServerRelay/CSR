module.exports = {
	name: 'staffjoin',
	alias:['staffjoins'],
	staff: 'sends a join request to a server',
	/**
     *
     * @param {Discord.Message} message
     * @param {[]} args
     */
	async execute(message, args) {
		const { staff } = require('./stafflist.json');
		if(staff.findIndex(x=>x === message.author.id) !== -1) {
			const sv = message.client.guilds.find(x=>x.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) != -1);
			if(sv) {
				if(!sv.me.hasPermission('CREATE_INSTANT_INVITE') || !sv.me.hasPermission('ADMINISTRATOR')) {
					return message.channel.send('insufficient permissions in the guild you want to join');
				}
				const ch = sv.channels.find(x=>x.name === 'irc');
				if (ch) {
					const bans = await sv.fetchBans();
					if(bans.has(message.author.id)) {
						await sv.unban(message.author.id);
					}
					message.author.send('staff bypass');
					ch.createInvite({ maxAge:0 }, 'someone requested to join this server')
						.then((invite)=>{
							message.author.send(`${sv.name}'s invite code:${invite.url}`);
						})
						.catch((err)=>{
							console.log(err);
						});
				}
				else{
					return message.author.send('server has no #irc channel for me to get an invite from');
				}
			}
			else{
				return message.author.send('could not find the desired server, either try a more/less precise search or it maybe just doesnt exist');
			}
		}
		else{
			return message.send('insufficient permissions');
		}
	},
};