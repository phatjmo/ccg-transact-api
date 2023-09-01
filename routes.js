const { storeTransactACH, storeTransactCC } = require('./mssql-datasource');
const { validateCreditCardNumber, validateABARoutingNumber, checkAPIKey, isExpDateValid } = require('./helpers')

const creditCardRoute = async (requestPayload, reply) => {

  const {
    phoneNo,
    accountNo,
    leadID,
    creditCardNo,
    creditCardExp,
    creditCardSec
  } = requestPayload;


  // Verify Exp Date
  if (!isExpDateValid(creditCardExp)) {
    reply.code(400).send({ message: 'Invalid Expiration Date' });
    return;
  }

  // Verify Credit Card Number
  if (!validateCreditCardNumber(creditCardNo)) {
    reply.code(400).send({ message: 'Invalid Credit Card Number' });
    return;
  }

  try {
    await storeTransactCC(phoneNo, accountNo, leadID, creditCardNo, creditCardExp, creditCardSec)
    // Depending on your stored procedure's response, you may want to send specific messages or status codes
    reply.send({ message: 'Transaction stored successfully.' });
    
  } catch (err) {
    reply.code(500).send({ message: 'Internal Server Error', error: err });
  }
}

const achRoute = async (requestPayload, reply) => {
  const {
    phoneNo,
    accountNo,
    leadID,
    achRoutingNo,
    achAccountNo,
  } = requestPayload;

  // Verify routing Number
  if (!validateABARoutingNumber(achRoutingNo)) {
    reply.code(400).send({ message: 'Invalid Routing Number' });
    return;
  }

  try {
    await storeTransactACH(phoneNo, accountNo, leadID, achRoutingNo, achAccountNo)
    reply.send({ message: 'Transaction stored successfully.' });

  } catch (err) {
    reply.code(500).send({ message: 'Internal Server Error', error: err });
  }
}

function routes(fastify, options, done) {

  // Credit Card Transaction Routes
  fastify.get('/api/transactions/creditcard', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          phoneNo: { type: 'string' },
          accountNo: { type: 'string' },
          leadID: { type: 'string' },
          creditCardNo: { type: 'string' },
          creditCardExp: { type: 'string' },
          creditCardSec: { type: 'string' },
        },
        required: ['phoneNo', 'accountNo', 'leadID', 'creditCardNo', 'creditCardExp', 'creditCardSec']
      }
    },
  }, async (request, reply) => {
    // Secure Route: Check API Key
    checkAPIKey(request, reply)
    // Implementation of your route
    await creditCardRoute(request.query, reply)

  });
  
  fastify.post('/api/transactions/creditcard', {
    schema: {
      body: {
        type: 'object',
        properties: {
          phoneNo: { type: 'string' },
          accountNo: { type: 'string' },
          leadID: { type: 'string' },
          creditCardNo: { type: 'string' },
          creditCardExp: { type: 'string' },
          creditCardSec: { type: 'string' },
        },
        required: ['phoneNo', 'accountNo', 'leadID', 'creditCardNo', 'creditCardExp', 'creditCardSec']
      }
    },
  }, async (request, reply) => {
    // Secure Route: Check API Key
    checkAPIKey(request, reply)
    // Implementation of your route
    await creditCardRoute(request.body, reply)
  });

  // ACH Transaction Routes
  fastify.get('/api/transactions/ach', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          phoneNo: { type: 'string' },
          accountNo: { type: 'string' },
          leadID: { type: 'string' },
          achRoutingNo: { type: 'string' },
          achAccountNo: { type: 'string' },
        },
        required: ['phoneNo', 'accountNo', 'leadID', 'achRoutingNo', 'achAccountNo']
      }
    },
  }, async (request, reply) => {
    // Secure Route: Check API Key
    checkAPIKey(request, reply)
    // Implementation of your route
    await achRoute(request.query, reply)
  });
  
  fastify.post('/api/transactions/ach', {
    schema: {
      body: {
        type: 'object',
        properties: {
          phoneNo: { type: 'string' },
          accountNo: { type: 'string' },
          leadID: { type: 'string' },
          achRoutingNo: { type: 'string' },
          achAccountNo: { type: 'string' },
        },
        required: ['phoneNo', 'accountNo', 'leadID', 'achRoutingNo', 'achAccountNo']
      }
    },
  }, async (request, reply) => {
    // Secure Route: Check API Key
    checkAPIKey(request, reply)
    // Implementation of your route
    await achRoute(request.body, reply)
  });

  done();
}

module.exports = routes;
