const sql = require('mssql');

// Update the configuration according to your MSSQL setup
const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'localhost', 
  database: 'your_database',
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool;
  })
  .catch(err => console.log('Database Connection Failed - ', err));

module.exports = {
  sql, poolPromise
};
