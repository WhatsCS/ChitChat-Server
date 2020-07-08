/**
 * Database interaction file, any and all interactions that can be modularized and covered are here.
 * @module utils/database
 */
const bcrypt = require('bcrypt')

// TODO: Fix this to make it so tests are easier :/

/**
 * @async
 * @desc checks if the username exists, used for ensuring uuid collision is avoided.
 * @param {string} username
 * @returns {Promise|Promise<void>|PromiseLike<any>|Promise<any>}
 */
function usernameExists (username) {
  return User.find({ username: username })
    .select('username uuid -_id')
    .exec()
    .then((user) => {
      return user
    })
}

/**
 * @async
 * @desc fetches all public information for a user
 * @param {string} username
 * @param {string} uuid
 * @returns {Promise<T>}
 */
function userInfo (username, uuid) {
  if (username === undefined && uuid === undefined) {
    return User.find()
      .select('username uuid online -_id')
      .exec()
      .then((userlist) => {
        return userlist
      })
      .catch((err) => {
        console.error(err)
      })
  } else if (uuid === undefined) {
    return User.find({ username: username })
      .select('username uuid online -_id')
      .exec()
      .then((user) => {
        return user
      })
      .catch((err) => {
        console.error(err)
      })
  } else {
    return User.find({ username: username, uuid: uuid })
      .select('username uuid socketid online -_id')
      .exec()
      .then((user) => {
        return user
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

/**
 * @async
 * @desc given an email, this function will fetch the user. Mainly used internally.
 * @param {string} email
 * @returns {Promise<T>}
 */
function userInfoEmail (email) {
  return User.find({ email: email })
    .select('username uuid')
    .exec()
    .then((user) => {
      if (user.length === 0) {
        return -1
      }
      return user
    })
    .catch((err) => {
      console.error(err)
    })
}

/**
 * @desc given the user object and a response object, it will attempt to create the user and then tell the client if it was successful or not
 * @param {object} newUserObj - object containing username, email, hashed password.
 * @param {express.Response} response
 * @returns {express.Response} response
 */
function createUser (newUserObj, response) {
  const newUser = new User(newUserObj)
  return newUser.save((err) => {
    if (err) {
      console.error(err)
      return response
        .status(500)
        .json({ message: 'Error creating account' })
    } else {
      console.log('created record!')
      return response
        .status(200)
        .json({ message: 'Account Created, please login!' })
    }
  })
}

/**
 * @async
 * @desc Checks if the supplied password matches the hash on record.
 * @param {object} userinfo - contains email and password
 * @returns {Promise<T>}
 */
function checkUserPassword (userinfo) {
  return User.find({ email: userinfo.email })
    .select('password')
    .exec()
    .then((user) => {
      if (user.length === 0) {
        return -1
      }
      const passhash = user[0].password
      return bcrypt.compare(userinfo.password, passhash)
    })
    .catch((err) => {
      console.error(err)
    })
}

/**
 * @desc Used to update the users socketid in the database.
 * @param {object} userinfo - contains username, uuid
 * @param {string} socketid
 */
function setSocketID (userinfo, socketid) {
  const filter = { username: userinfo.username, uuid: userinfo.uuid }
  const update = { socketid: socketid }
  const query = User.findOneAndUpdate(filter, update)
  query.exec()
}

function setOnlineStatus (userinfo, status) {
  const filter = { username: userinfo.username, uuid: userinfo.uuid }
  const update = { online: status }
  const query = User.findOneAndUpdate(filter, update)
  query.exec()
}

module.exports = {
  usernameExists: usernameExists,
  userInfo: userInfo,
  userInfoEmail: userInfoEmail,
  createUser: createUser,
  checkUserPassword: checkUserPassword,
  setSocketID: setSocketID,
  setOnlineStatus: setOnlineStatus
}
