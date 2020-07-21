/**
 * Database interaction file, any and all interactions that can be modularized and covered are here.
 * @module utils/database
 */
const bcrypt = require('bcrypt')

const { modelToJSON } = require('../utils/gen')
const db = require('../models')
const User = db.User

/**
 * @async
 * @desc checks if the username exists, used for ensuring uid collision is avoided.
 * @param {string} username
 * @returns {Object | Array}
 */
async function usernameExists (username) {
  const usrQuery = await User.findAll({
    attributes: ['username', 'uid'],
    where: {
      username: username
    }
  })
  return modelToJSON(usrQuery)
}

/**
 * @async
 * @desc fetches all public information for a user
 * @param {string} username
 * @param {string} uid
 * @returns {Promise<T>}
 */
async function userInfo (username, uid) {
  let usrQuery = []
  if (username === undefined && uid === undefined) {
    usrQuery = await User.findAll({
      attributes: ['username', 'uid', 'status']
    })
  } else if (uid === undefined) {
    usrQuery = await User.findAll({ attributes: ['username', 'uid', 'status'], where: { username: username } })
  } else {
    usrQuery = await User.findAll({
      attributes:
      ['username', 'uid', 'socketID', 'status'],
      where: { username: username, uid: uid }
    })
  }
  return modelToJSON(usrQuery)
}

/**
 * @async
 * @desc given an email, this async function will fetch the user. Mainly used internally.
 * @param {string} email
 * @returns {Promise<T>}
 */
async function userInfoEmail (email) {
  const usrQuery = await User.findAll({ attributes: ['username', 'uid'], where: { email: email } })

  return modelToJSON(usrQuery)
}

/**
 * @desc given the user object and a response object, it will attempt to create the user and then tell the client if it was successful or not
 * @param {object} newUserObj - object containing username, email, hashed password, uid.
 * @param {express.Response} response
 * @returns {express.Response} response
 */
async function createUser (newUserObj, response) {
  const min = Math.ceil(1)
  const max = Math.floor(9999)
  let uid = Math.floor(Math.random() * (max - min + 1)) + min
  const exists = await usernameExists(newUserObj.username)
  if (exists) {
    for (let i = 0; i > exists.length; i++) {
      if (uid === exists[i].uid) {
        uid = Math.floor(Math.random() * (max - min + 1)) + min
        i = 0
      }
    }
  }

  newUserObj.uid = uid
  let result = await User.create(newUserObj)
  result = result.dataValues
  return result
}

/**
 * @async
 * @desc Checks if the supplied password matches the hash on record.
 * @param {object} userinfo - contains email and password
 * @returns {Promise<Boolean>}
 */
async function checkUserPassword (userinfo) {
  const user = await User.findAll({ attributes: ['password'], where: { email: userinfo.email } })
  if (user.length === 0) {
    return false
  }
  const passhash = user[0].dataValues.password
  return await bcrypt.compare(userinfo.password, passhash)
}

/**
 * @async
 * @desc Used to update the users socketid in the database.
 * @param {object} userinfo - must contain username, uid
 * @param {string} socketid - unique id set by socket.io
 */
async function setSocketID (userinfo, socketid) {
  const filter = { where: { username: userinfo.username, uid: userinfo.uid } }
  const update = { socketID: socketid }
  return await User.update(update, filter)
}

/**
 * @async
 * @desc Sets the status of a user, helpful for knowing if an invite will go through or not
 * @param {Array} userinfo - array of user information (username and uid)
 * @param {Enumerator} status - offline, online, away
 */
async function setOnlineStatus (userinfo, status) {
  const filter = { where: { username: userinfo.username, uid: userinfo.uid } }
  const update = { status: status }
  return await User.update(update, filter)
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
