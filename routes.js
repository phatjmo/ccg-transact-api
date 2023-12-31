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
    console.warn(`${creditCardExp} is and Invalid Expiration Date`)
    reply.code(200).send({ message: 'Invalid Expiration Date' });
    return;
  }

  // Verify Credit Card Number
  if (!validateCreditCardNumber(creditCardNo)) {
    console.warn('Invalid Credit Card Number')
    reply.code(200).send({ message: 'Invalid Credit Card Number' });
    return;
  }

  try {
    const transactionId = await storeTransactCC(phoneNo, accountNo, leadID, creditCardNo, creditCardExp, creditCardSec)
    // Depending on your stored procedure's response, you may want to send specific messages or status codes
    console.log(`creditCardRoute - storeTransactCC returned ${transactionId}`)
    reply.send({ message: 'Transaction stored successfully.', transactionId });
    return;
    
  } catch (err) {
    console.error('Request failed with: ', err)
    reply.code(200).send({ message: 'Internal Server Error', error: err });
    return;
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
    console.warn(`${achRoutingNo} is an Invalid Routing Number`)
    reply.code(200).send({ message: 'Invalid Routing Number' });
    return;
  }

  try {
    const transactionId = await storeTransactACH(phoneNo, accountNo, leadID, achRoutingNo, achAccountNo)
    console.log(`achRoute - storeTransactACH returned ${transactionId}`)
    reply.send({ message: 'Transaction stored successfully.', transactionId });
    return;

  } catch (err) {
    console.error('Request failed with: ', err)
    reply.code(200).send({ message: 'Internal Server Error', error: err });
    return;
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
    return;
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
    return;
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
    return;
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
    return;
  });

  done();
}

module.exports = routes;
