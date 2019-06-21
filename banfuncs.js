const jndb=require('jndb')
module.exports.CSRBan = function(client, usr) {
	let db=new jndb.Connection()
	db.use('data')
	client.banlist.set(usr.id, usr.tag.replace('\'', ''));
	const data = db.secure('bans', {});
	data[usr.id] = usr.tag.replace('\'', '');
	db.indert('bans', data);
};

module.exports.CSRUnban = function(client, usr) {
	let db=new jndb.Connection()
	db.use('data')
	client.banlist.delete(usr.id);
	const data = db.fetch('bans');
	data[usr.id] ? delete data[usr.id] : '';
	db.insert('bans', data);
};