const { MongoClient } = require('mongodb')
const app = require('../app')
const request = require('supertest')

describe('Initiating all things for further router tests', () => {
  let connection
  let db

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db(global.__MONGO_DB_NAME__)
    await db.collection('COLLECTION_NAME').deleteMany({})
  })

  afterAll(async () => {
    await connection.close()
    await db.close()
  })

  it('POST to Register endpoint', async () => {
    const res = await request(app.server)
      .post('/login/register')
      .send({
        email: 'test@jointheb.org',
        username: 'test',
        password: 'test'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message', 'Account Created, please login!')
  })
})
