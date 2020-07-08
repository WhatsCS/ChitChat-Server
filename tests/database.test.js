const { MongoClient } = require('mongodb')
const dbUtils = require('../utils/database')

describe('Test database.js functions', () => {
  let connection
  let db

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db(global.__MONGO_DB_NAME__)
    // clear the db of any old records before continuing
    await db.collection('COLLECTION_NAME').deleteMany({})

    const user = db.collection('user')
    const mockUsers = [{
      username: 'test1',
      email: 'test@jointheb.org',
      password: 'test',
      uuid: '1234'
    },
    {
      username: 'test2',
      email: 'example@jointheb.org',
      password: 'test',
      uuid: '1235'
    }]
    await user.insertMany(mockUsers)
  })

  afterAll(async () => {
    await connection.close()
    await db.close()
  })

  it('gets info on user via email only', async () => {
    const user = await dbUtils.userInfoEmail('test@jointheb.org')
    expect(user).toMatchObject([{ _id: expect.anything(), username: 'test1', uuid: '1234' }])
  })
})
