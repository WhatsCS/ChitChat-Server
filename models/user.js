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
      type: DataTypes.INTEGER,
      unique: true,
      get () {
        let result = this.getDataValue('uid').toString()
        if (result.length === 4) return result
        const numZeros = 4 - result.length
        for (let i = 1; i <= numZeros; i++) {
          result = '0' + result
        }
        return result
      }
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