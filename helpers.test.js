const { validateCreditCardNumber, validateABARoutingNumber, isExpDateValid } = require('./helpers');

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

test('isExpDateValid returns true when Exp Date is valid', () => {
  const expDate = '0526'; // A valid exp date
  const compareDate = new Date('2023-05-01'); // because it's in the future
  expect(isExpDateValid(expDate, compareDate)).toBe(true);
});

test('isExpDateValid returns false when Exp Date is invalid', () => {
  const expDate = '0520'; // An ivalid exp date
  const compareDate = new Date('2023-05-01'); // because it's in the past
  expect(isExpDateValid(expDate, compareDate)).toBe(false);
});

test('isExpDateValid returns true when Exp Date is the same month as Compare date', () => {
  const expDate = '0523'; // An ivalid exp date
  const compareDate = new Date('2023-05-01'); // because it's in the past
  expect(isExpDateValid(expDate, compareDate)).toBe(true);
});

test('isExpDateValid returns false when Exp Date is\'nt a number', () => {
  const expDate = 'NaN'; // Not a number
  const compareDate = new Date('2023-05-01');
  expect(isExpDateValid(expDate, compareDate)).toBe(false);
});

test('isExpDateValid returns true when Exp Date is\'nt in MMDD format', () => {
  const expDate = '525'; // Not a number
  const compareDate = new Date('2023-05-01');
  expect(isExpDateValid(expDate, compareDate)).toBe(true);
});