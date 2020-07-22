const bcrypt = require('bcrypt')
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init({
    username: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      set (val) {
        const hash = bcrypt.hashSync(val, 12)
        this.setDataValue('password', hash)
      }
    },
    uid: {
      type: DataTypes.STRING(4),
      unique: true
    },
    socketID: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    status: {
      type: DataTypes.ENUM({
        values: ['offline', 'online', 'away']
      }),
      defaultValue: 'offline'
    }
  }, { sequelize })
  return User
}
