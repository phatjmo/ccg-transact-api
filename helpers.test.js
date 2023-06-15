const { validateCreditCardNumber, validateABARoutingNumber } = require('./helpers');

test('validateCreditCardNumber returns true for valid number', () => {
  const number = '4532015112830366'; // A valid VISA card number that passes the Luhn check
  expect(validateCreditCardNumber(number)).toBe(true);
});

test('validateCreditCardNumber returns false for invalid number', () => {
  const number = '1234567890123456'; // An invalid card number
  expect(validateCreditCardNumber(number)).toBe(false);
});

test('validateABARoutingNumber returns true for valid number', () => {
  const number = '021000021'; // A valid routing number for JPMorgan Chase Bank
  expect(validateABARoutingNumber(number)).toBe(true);
});

test('validateABARoutingNumber returns false for invalid number', () => {
  const number = '123456789'; // An invalid routing number
  expect(validateABARoutingNumber(number)).toBe(false);
});
