const dbUtils = require('../utils/db')
let globalUser = {}

describe('Testing database.js functions', () => {
  it('firstly creates a new user', async () => {
    const nuser = {
      username: 'test_user1',
      email: '1@jointheb.org',
      password: 'test'
    }
    const usr = await dbUtils.createUser(nuser)
    globalUser = usr
    return expect(usr).toEqual(expect.objectContaining({ username: nuser.username, email: nuser.email }))
  })
  it('gets info on a user via username only', async () => {
    const lookup = await dbUtils.userInfo('test_user1')
    if (typeof lookup === 'object') {
      return expect(lookup).toEqual(expect.objectContaining({ username: 'test_user1', uid: expect.any(String) }))
    }
  })
  it('gets info on user via email only', async () => {
    const lookup = await dbUtils.userInfoEmail('1@jointheb.org')
    return expect(lookup).toEqual(expect.objectContaining({ username: 'test_user1', uid: expect.any(String) }))
  })
  it('checks the users password hashing', async () => {
    const checks = await dbUtils.checkUserPassword({ email: globalUser.email, password: 'test' })
    return expect(checks).toBe(true)
  })
  it('updates user socketID', async () => {
    // we need to find the user for uid
    const updated = await dbUtils.setSocketID({ username: globalUser.username, uid: globalUser.uid }, 'asd125-dfsah5-gfds-g523')
    return expect(updated).toEqual([1])
  })
  it('updates user status', async () => {
    // we need to find the user for uid
    const updated = await dbUtils.setOnlineStatus({ username: globalUser.username, uid: globalUser.uid }, 'online')
    return expect(updated).toEqual([1])
  })
})
