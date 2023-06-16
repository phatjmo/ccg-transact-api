require('dotenv').config()

const env = process.env

const mssqlConfig = {
  user: env.MSSQL_USER || 'your_user',
  password: env.MSSQL_PASS || 'your_password',
  server: env.MSSQL_HOST || 'localhost',
  database: env.MSSQL_DB || 'your_database',
}

module.exports = {
  mssqlConfig
}