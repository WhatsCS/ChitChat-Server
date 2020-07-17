module.exports = {
  development: {
    username: 'Dev',
    password: 'test pass',
    database: 'ChitChat_development',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: 'Dev',
    password: 'test pass',
    database: 'ChitChat_test',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
}
