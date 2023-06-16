const sql = require('mssql');
const { mssqlConfig } = require('./config')

const { user, password, server, database } = mssqlConfig
// console.log(`${user}:${password} -> ${server}/${database}`)

const config = {
  user,
  password,
  server,
  database,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true,
    trustServerCertificate: true
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
  //let pool = await sql.connect(config)
  //let pool = await sql.connect(`Server=${server},1433;Database=${database};User Id=${user};Password=${password};Encrypt=true`)
  
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
