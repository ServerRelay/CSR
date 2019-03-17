module.exports.CSRBan = async function(client, usr, db) {
	client.banlist.set(usr.id, true);
	const data = await db.secure('bans', {});
	data[usr.id] = usr.tag;
	await db.set('bans', data);
};

module.exports.CSRUnban = async function(client, usr, db) {
	client.banlist.delete(usr.id);
	const data = await db.get('bans');
	data[usr.id] ? delete data[usr.id] : '';
	await db.set('bans', data);
};