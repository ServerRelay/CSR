const jndb = require('jndb');
module.exports.CSRBan = function(client, usr) {
	client.db.use('data');
	client.banlist.set(usr.id, usr.tag.replace("'", ''));
	const data = client.db.secure('bans', {});
	data[usr.id] = usr.tag.replace("'", '');
	client.db.indert('bans', data);
};

module.exports.CSRUnban = function(client, usr) {
	client.db.use('data');
	client.banlist.delete(usr.id);
	const data = client.db.fetch('bans');
	data[usr.id] ? delete data[usr.id] : '';
	client.db.insert('bans', data);
};
