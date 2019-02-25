module.exports = {
	name: 'servernames',
	alias:['snames'],
	staff: 'fetch all server names(delta only)',
	/**
     *
     * @param {Discord.Message} message
     * @param {[]} args
     */
	async execute(message, args) {
		let text;
		if(message.author.id != '298258003470319616') {
			return;
		}

		message.client.guilds.forEach((guild)=>{
			text += guild.name + '\n';
		});
		message.author.send(text, { split:true });
	},
};