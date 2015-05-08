/**
 * Account - representing a login account at a connected service like Google, Facebook, Openid etc.
 *
 * @param uid     The unique identifier on the connected system
 * @param system  The authentication system - normally the passport strategy used.
 * @param user    The User ID.
 */
function Account(id, uid, system, user) {
  this.id     = id
  this.uid    = uid
  this.system = system
  this.user   = user
}
Account.getOrCreate = function(system, uid, displayName) {
  return global.app.locals.db
    .get('SELECT * FROM accounts WHERE system = ? AND uid = ?', system, uid)
    .then(function(account_data) {
      if (typeof account_data === 'undefined') {
        return User.create(displayName, 'http://graph.facebook.com/' + uid + '/picture')
          .then(function(user) {
            return global.app.locals.db.run(
              'INSERT INTO accounts (uid, system, user) VALUES (?,?,?)', uid, system, user.id
            )
          }).then(function(db) {
            return new Account(db.lastID, uid, system, user.id)
          })
      }
      else {
        return new Account(account_data.id, uid, system, account_data.user)
      }
    })
}

module.exports = Account