const { sql, poolPromise } = require('./mssql-datasource');
const { validateCreditCardNumber, validateABARoutingNumber } = require('./helpers')
function routes(fastify, options, done) {
  
  // Credit Card Transaction Route
  fastify.post('/api/transactions/creditcard', {
    schema: {
      body: {
        type: 'object',
        properties: {
          phoneNo: { type: 'string' },
          accountNo: { type: 'string' },
          leadID: { type: 'string' },
          amount: { type: 'number' },
          creditCardNo: { type: 'string' },
          creditCardExp: { type: 'string' },
        },
        required: ['phoneNo', 'accountNo', 'leadID', 'amount', 'creditCardNo', 'creditCardExp']
      }
    },
  }, async (request, reply) => {
    // Implementation of your route
    const {
      phoneNo,
      accountNo,
      leadID,
      amount,
      creditCardNo,
      creditCardExp,
    } = request.body;
  
    // Verify Credit Card Number
    if (!validateCreditCardNumber(creditCardNo)) {
      reply.code(400).send({ message: 'Invalid Credit Card Number' });
      return;
    }

    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('phone', sql.NVarChar(10), phoneNo)
        .input('account', sql.NVarChar(256), accountNo)
        .input('leadid', sql.Int, leadID)
        .input('ccnumber', sql.NVarChar(16), creditCardNo)
        .input('ccexp', sql.NVarChar(4), creditCardExp)
        .execute('dbo.TransactCreditCard');
      
      // Depending on your stored procedure's response, you may want to send specific messages or status codes
      reply.send({ message: 'Transaction stored successfully.' });
      
    } catch (err) {
      reply.code(500).send({ message: 'Internal Server Error', error: err });
    }
  });

  // ACH Transaction Route
  fastify.post('/api/transactions/ach', {
    schema: {
      body: {
        type: 'object',
        properties: {
          phoneNo: { type: 'string' },
          accountNo: { type: 'string' },
          leadID: { type: 'string' },
          amount: { type: 'number' },
          achRoutingNo: { type: 'string' },
          achAccountNo: { type: 'string' },
        },
        required: ['phoneNo', 'accountNo', 'leadID', 'amount', 'achRoutingNo', 'achAccountNo']
      }
    },
  }, async (request, reply) => {
    // Implementation of your route
    const {
      phoneNo,
      accountNo,
      leadID,
      amount,
      achRoutingNo,
      achAccountNo,
    } = request.body;
  
    // Verify routing Number
    if (!validateABARoutingNumber(achRoutingNo)) {
      reply.code(400).send({ message: 'Invalid Routing Number' });
      return;
    }

    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('phone', sql.NVarChar(10), phoneNo)
        .input('account', sql.NVarChar(256), accountNo)
        .input('leadid', sql.Int, leadID)
        .input('achroute', sql.NVarChar(9), achRoutingNo)
        .input('achaccount', sql.NVarChar(17), achAccountNo)
        .execute('dbo.TransactACH');

      reply.send({ message: 'Transaction stored successfully.' });

    } catch (err) {
      reply.code(500).send({ message: 'Internal Server Error', error: err });
    }
  });

  done();
}

module.exports = routes;
