module.exports.CSRBan = async function(client, db, usr) {
	// await db.query(`INSERT INTO banned (id) VALUES (${usr.id}) ON CONFLICT(id) DO UPDATE SET id=EXCLUDED.id;`)
	await db.query(`INSERT INTO banned(id) VALUES(${usr.id}) ON CONFLICT (id) DO NOTHING`);
	client.banlist.push(usr.id);
};

module.exports.CSRUnban = async function(client, db, usr) {
	await db.query(`DELETE FROM banned WHERE id = '${usr.id}'`);
	client.banlist.splice(client.banlist.findIndex(x=>x == usr.id), 1);

};