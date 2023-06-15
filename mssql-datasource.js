const sql = require('mssql');
require('dotenv').config()

const env = process.env

const config = {
  user: env.MSSQL_USER || 'your_user',
  password: env.MSSQL_PASSWORD || 'your_password',
  server: env.MSSQL_HOST || 'localhost',
  database: env.MSSQL_DB || 'your_database',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true,
    trusServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool;
  })
  .catch(err => console.log('Database Connection Failed - ', err));

const storeTransactACH = async (phoneNo, accountNo, leadID, achRoutingNo, achAccountNo) => {
  const pool = await poolPromise;
  return await pool.request()
    .input('phone', sql.NVarChar(10), phoneNo)
    .input('account', sql.NVarChar(256), accountNo)
    .input('leadid', sql.Int, leadID)
    .input('achroute', sql.NVarChar(9), achRoutingNo)
    .input('achaccount', sql.NVarChar(17), achAccountNo)
    .execute('dbo.TransactACH');
}

const storeTransactCC = async (phoneNo, accountNo, leadID, creditCardNo, creditCardExp) => {
  const pool = await poolPromise;
  return await pool.request()
    .input('phone', sql.NVarChar(10), phoneNo)
    .input('account', sql.NVarChar(256), accountNo)
    .input('leadid', sql.Int, leadID)
    .input('ccnumber', sql.NVarChar(16), creditCardNo)
    .input('ccexp', sql.NVarChar(4), creditCardExp)
    .execute('dbo.TransactCreditCard');
}

module.exports = {
  sql,
  poolPromise,
  storeTransactACH,
  storeTransactCC
};
