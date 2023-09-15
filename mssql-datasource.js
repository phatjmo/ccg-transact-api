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
  // dbo.TransactACH (@phone nvarchar(10),@account nvarchar(256),@leadid NVarChar(50),@achroute nvarchar(9),@achaccount nvarchar(17))
  const result = await pool.request()
    .input('phone', sql.NVarChar(10), phoneNo)
    .input('account', sql.NVarChar(256), accountNo)
    .input('leadid', sql.NVarChar(50), leadID)
    .input('achroute', sql.NVarChar(9), achRoutingNo)
    .input('achaccount', sql.NVarChar(17), achAccountNo)
    .execute('dbo.TransactACH')
    .catch(ex => {
      console.error('storeTransactACH failed with:', ex)
      throw ex
    });
  console.log('storeTransactACH succeeded with:', result)
  /*
    Result: {
      recordsets: [ [ [Object] ] ],
      recordset: [ { ID: 39 } ],
      output: {},
      rowsAffected: [],
      returnValue: 0
    }
  */
    const [ record ] = result?.recordset || []
    return record?.ID
}

const storeTransactCC = async (phoneNo, accountNo, leadID, creditCardNo, creditCardExp, creditCardSec) => {
  const pool = await poolPromise;
  // dbo.TransactCreditCard (@phone nvarchar(10),@account nvarchar(256),@leadid NVarChar(50),@ccnumber nvarchar(16),@ccexp nvarchar(4),@ccsec nvarchar(4))
  const result = await pool.request()
    .input('phone', sql.NVarChar(10), phoneNo)
    .input('account', sql.NVarChar(256), accountNo)
    .input('leadid', sql.NVarChar(50), leadID)
    .input('ccnumber', sql.NVarChar(16), creditCardNo)
    .input('ccexp', sql.NVarChar(4), creditCardExp)
    .input('ccsec', sql.NVarChar(4), creditCardSec)
    .execute('dbo.TransactCreditCard')
    .catch(ex => {
      console.error('storeTransactCC failed with:', ex)
      throw ex
    });
  console.log('storeTransactCC succeeded with:', result)
  /*
    Result: {
      recordsets: [ [ [Object] ] ],
      recordset: [ { ID: 39 } ],
      output: {},
      rowsAffected: [],
      returnValue: 0
    }
  */
  const [ record ] = result?.recordset || []
  return record?.ID
}

module.exports = {
  sql,
  poolPromise,
  storeTransactACH,
  storeTransactCC
};
