const { Command } = require('easy-djs-commandhandler');
module.exports = new Command({
	name: 'fdata',
	description: '',
	aliases: ['data'],
	requires: ['botowner'],
	requiresBotPermissions: ['ATTACH_FILES'],
	hideinhelp: true,
}).execute(async (client, message, args) => {
	const msg = await message.channel.send('please wait...');
	const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	await wait(3000);
	const files = ['./jndb.json', './jndbBackup.json', './prefixes.json'];
	await msg.delete();
	message.channel.send({ files });
});
