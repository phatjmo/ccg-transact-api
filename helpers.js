const keys = require('./keys.json');

function validateCreditCardNumber(cardNumber) {
  let nums = Array.from(cardNumber, Number);
  for (let i = nums.length - 2; i >= 0; i -= 2) {
    nums[i] *= 2;
    if (nums[i] > 9) nums[i] -= 9;
  }
  return nums.reduce((a, b) => a + b) % 10 === 0;
}

function validateABARoutingNumber(routingNumber) {
  if (!routingNumber) { //all 0's is technically a valid routing number, but it's inactive
    return false;
  }

  var routing = routingNumber.toString();
  while (routing.length < 9) {
    routing = '0' + routing; //I refuse to import left-pad for this
  }

  //gotta be 9  digits
  var match = routing.match("^\\d{9}$");
  if (!match) {
    return false;
  }

  //The first two digits of the nine digit RTN must be in the ranges 00 through 12, 21 through 32, 61 through 72, or 80.
  //https://en.wikipedia.org/wiki/Routing_transit_number
  const firstTwo = parseInt(routing.substring(0, 2));
  const firstTwoValid = (0 <= firstTwo && firstTwo <= 12)
    || (21 <= firstTwo && firstTwo <= 32)
    || (61 <= firstTwo && firstTwo <= 72)
    || firstTwo === 80;
  if (!firstTwoValid) {
    return false;
  }

  //this is the checksum
  //http://www.siccolo.com/Articles/SQLScripts/how-to-create-sql-to-calculate-routing-check-digit.html
  const weights = [3, 7, 1];
  var sum = 0;
  for (var i = 0; i < 8; i++) {
    sum += parseInt(routing[i]) * weights[i % 3];
  }

  return (10 - (sum % 10)) % 10 === parseInt(routing[8]);
}

const checkAPIKey = (request, reply) => {
   // Try to get the API key from the header first
   let apiKey = request.headers['x-api-key'];

   // If not found, try to get it from the query string
   if (!apiKey) {
     apiKey = request.query['x-api-key'];
   }
 
   // If the API key is still not found or doesn't match any key in your list, reject the request
   if (!apiKey || !keys.keys.includes(apiKey)) {
     reply.code(401).send({ message: 'Invalid API Key' });
   }
}

const isExpDateValid = (inputDate, currentDate = new Date()) => {
  if(isNaN(inputDate)) return false
  if(inputDate.length == 3) inputDate = `0${inputDate}`
  // Extract the month and year from the input string MMYY
  const inputMonth = parseInt(inputDate.substring(0, 2), 10);
  const inputYear = parseInt("20" + inputDate.substring(2, 4), 10);

  // Create a Date object for the input date
  const inputDateObject = new Date(inputYear, inputMonth - 1);  // months are 0-based in JavaScript

  // Create a Date object for the current date minus one month
  currentDate.setMonth(currentDate.getMonth() - 1);

  // Zero out the time portions to only compare the date
  inputDateObject.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  // Compare dates and return the boolean value
  return inputDateObject >= currentDate;
}


module.exports = {
  validateCreditCardNumber,
  validateABARoutingNumber,
  checkAPIKey,
  isExpDateValid,
}