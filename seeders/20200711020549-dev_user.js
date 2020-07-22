const { User } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await User.create({
      username: 'dev_user',
      email: 'dev@jointheb.org',
      password: 'test password',
      uid: '1234'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
