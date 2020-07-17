require('dotenv').config()
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const usersRouter = require('./routes/users')
const loginRouter = require('./routes/login')

const io = require('socket.io')(server)
const socketioJWT = require('socketio-jwt')

const db = require('./utils/db')

// add middleware to express server
app.use(logger('dev'))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false
  })
)
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(cookieParser())

app.use('/users', usersRouter)
app.use('/login', loginRouter)

io.use(socketioJWT.authorize({
  secret: require('./utils/auth.js').secret,
  auth_header_required: true
}))

io.on('connection', (socket) => {
  let addedUser = false
  let room
  socket.emit('do login')

  socket.on('login', (username, uid) => {
    if (addedUser) return

    socket.username = username
    socket.uid = uid
    addedUser = true
    db.setSocketID({ username, uid }, socket.id)
    db.setOnlineStatus({ username, uid }, true)

    console.log('\\********************************/')
    console.log(`Username#uid: ${socket.username}#${socket.uid}`)
    console.log('The current userid is: ' + socket.id)
    console.log('Headers are:')
    console.dir(socket.handshake.headers)
    console.log('/********************************\\')
  })

  socket.on('invite contact', (username, uid) => {
    db.userInfo(username, uid).then((user) => {
      room = socket.id + username + uid
      socket.join(room)
      socket.to(user.socketid).emit('invited', room)
    })
  })

  socket.on('send message', (msgObj) => {
    console.log('received sendMessage containing:')
    console.dir(msgObj)
    socket.to(msgObj.room).emit('newMessage', msgObj)
  })

  socket.on('encrypt chat', (pub, room) => {
    console.log('key exchange initiated by' + socket.username)
    socket.to(room).emit('key exchange', pub)
  })

  socket.on('leave room', (room) => {
    socket.leave(room, () => {
      io.to(room).emit(`${socket.username} left the room :(`)
    })
  })

  socket.on('disconnect', () => {
    console.log('Disconnected user: ' + socket.id)
  })
})

module.exports = {
  app,
  server
}
