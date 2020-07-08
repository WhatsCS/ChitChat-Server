let mongoose

exports.init = (mongo) => {
  mongoose = mongo
}

const mondb = mongoose.connection
mondb.on('error', console.error.bind(console, 'connection error!'))
// mondb.once('open', function (callback) {
//   console.log('Connection succeeded!')
// })

/**
 * @desc User schema definition
 * @type {mongoose.Schema}
 */
const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    uuid: Number,
    socketid: {
      type: String,
      default: null
    },
    online: {
      type: String,
      default: false
    }
  },
  { timestamps: true }
)

// TODO: Initialize our user schema with a given mongoose instance.
exports.User = mongoose.model('User', UserSchema)
