module.exports = {
  development: {
    username: 'Dev',
    password: 'test pass',
    database: 'ChitChat_development',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  // ENV variables are for GitHub Actions
  test: {
    username: process.env.POSTGRES_USER || 'Dev',
    password: process.env.POSTGRES_PASSWORD || 'test pass',
    database: process.env.POSTGRES_DB || 'ChitChat_test',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
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
