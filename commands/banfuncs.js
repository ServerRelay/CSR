const pg=require('pg')
const Discord=require('discord.js')


module.exports.CSRBan=async function (client,db,usr){
            await db.query(`INSERT OR REPLACE INTO banned (id) VALUES (?)`,[usr.id])
            client.banlist.push(usr.id)
}

/**
 * @param {sqlite.DB} db database
 * @param {Discord.User} usr user
 */
module.exports.CSRUnban=function (client,db,usr){
    db.query(`DELETE FROM banned WHERE id = ${usr.id}`)
    client.banlist.splice(client.banlist.findIndex(x=>x==usr.id),1)

}