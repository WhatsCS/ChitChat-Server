/**
 * Users route definitions
 * @module routes/users
 */
const express = require('express')
const router = express.Router()
const auth = require('../utils/auth')
const dbUtils = require('../utils/db')

/**
 * @name Users root GET
 * @desc On a GET request, it will return all known users
 * @return {express.Response} response - Returns a list of users
 */
router.get('/', auth.isAuthenticated, async (req, res) => {
  dbUtils.userInfo().then((userlist) => {
    if (userlist.length === 0) {
      return res.status(404).json({
        message: 'No users!?!?'
      })
    }
    return res.status(200).json({
      users: userlist
    })
  }).catch((err) => {
    console.error(err)
  })
})

/**
 * @name Specific Username GET Request
 * @desc On a GET request with a `name`, it will find all matching usernames and return their info.
 * @param {string} user - a string in the format of `name`
 * @return {express.Response} response - Returns a list of usernames and their id's
 */
router.get('/:name', auth.isAuthenticated, function (req, res, next) {
  dbUtils.userInfo(req.params.name).then((userlist) => {
    if (userlist.length === 0) {
      return res.status(404).json({
        message: 'Users not found!'
      })
    }
    return res.status(200).json({
      users: userlist
    })
  })
})

/**
 * @name Specific User GET Request
 * @desc On a GET request with a `name-uid`, it will find the matching user and return their info.
 * @param {string} user - a string in the format of `name-uid`
 * @return {express.Response} response - Returns a specific user
 */
router.get('/:name-:uid', auth.isAuthenticated, function (req, res, next) {
  dbUtils.userInfo(req.params.name, req.params.uid).then((user) => {
    if (user.length === 0) {
      return res.status(404).json({
        message: 'User not found!'
      })
    }
    return res.status(200).json({
      username: user.username,
      uid: user.uid,
      socketid: user.socketID,
      status: user.status
    })
  })
})

module.exports = router
