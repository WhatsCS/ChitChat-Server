/**
 * login route definitions
 * @module routes/login
 */
const express = require('express')
const router = express.Router()
const dbUtils = require('../utils/db')
const auth = require('../utils/auth')

/**
 * @async
 * @name login root POST
 * @desc On a POST request, it will "log" the user in and return their auth token
 * @param {string} email - users email
 * @param {string} password - users password
 * @return {express.Response} response - returns their auth token, uid and username
 */
router.post('/', async (req, res) => {
  const user = { email: req.body.email, password: req.body.password }
  if (user.email && user.password) {
    const _res = await dbUtils.checkUserPassword(user)
    if (_res) {
      try {
        const info = await dbUtils.userInfoEmail(user.email)
        const token = auth.createToken(user)
        return res.status(200).json({
          token: token,
          uid: info.uid,
          username: info.username
        })
      } catch (err) {
        console.error(err)
        return res.status(500)
      }
    } else {
      return res.status(400).json({
        message: 'Email or Password is incorrect'
      })
    }
  } else {
    return res.status(400).json({
      message: 'Missing required fields!'
    })
  }
})

/**
 * @async
 * @name Register Route
 * @desc Registers the user with the database.
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @return {express.Response} response - Tells the client if they are registered or not
 */
router.post('/register', async (req, res) => {
  const body = req.body
  if (!body.hasOwnProperty('username') || !body.hasOwnProperty('email') || !body.hasOwnProperty('password')) { // eslint-disable-line
    return res.status(400).json({
      message: 'Missing a field, please double check.'
    })
  }
  const user = {
    username: body.username,
    email: body.email,
    password: body.password
  }
  try {
    const createdUser = await dbUtils.createUser(user)
    if (!createdUser) {
      return res.status(500).json({
        message: 'Something fucked up'
      })
    }
    return res.status(200).json({
      message: 'Account created!',
      username: createdUser.username,
      email: createdUser.email,
      uid: createdUser.uid
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: 'Something went wrong, sorry!'
    })
  }
})

module.exports = router
