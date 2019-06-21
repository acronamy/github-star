const { isUnsigned } = require('../utils/format-utils');
const { daysUntilMonthEnd, getMonthLength, previousRelativeMonthDay, datePad } = require('../utils/time-utils');

describe('daysUntilMonthEnd', () => {
  test('28th of FEB 2019 the days until the months end should be 0', () => {
    expect(daysUntilMonthEnd({
      year: 2019,
      month: 1, // 0 index FEB
      day: 28
    })).toBe(0);
  });
  test('1st of FEB 2019 the days until the months end should be -27', () => {
    expect(daysUntilMonthEnd({
      year: 2019,
      month: 1, // 0 index FEB
      day: 1
    })).toBe(-27);
  });
  test('at a day which does not exist in the month of FEB 2019 the days until the months end should be positive n', () => {
    expect(daysUntilMonthEnd({
      year: 2019,
      month: 1, // 0 index FEB
      day: 31
    })).toBe(3);
  });
});

describe('getMonthLength', () => {
  test('2nd of FEB 2019 the last day of the month should be 28', () => {
    expect(getMonthLength({
      year: 2019,
      month: 2, // 1 index FEB
    })).toBe(28);
  });
  test('2nd of FEB 2019 the last day of the month should be 28', () => {
    expect(getMonthLength({
      year: 2019,
      month: 1, // 1 index JAN
    })).toBe(31);
  });
});

describe('previousRelativeMonthDay', () => {
  test('16th of DEC 2019 the 16th of NOV should be reported', () => {
    expect(previousRelativeMonthDay({
      year: 2019,
      month: 12, // 1 index FEB
      day: 16
    })).toBe(16);
  });
  test('29th .. 31st of MAR 2018 the 28th of FEB should be reported until the 1st of next month is available', () => {
    expect(previousRelativeMonthDay({
      year: 2018,
      month: 2, // 0 index MAR
      day: 28
    })).toBe(28);
    expect(previousRelativeMonthDay({
      year: 2018,
      month: 2, // 0 index MAR
      day: 29
    })).toBe(28);
    expect(previousRelativeMonthDay({
      year: 2018,
      month: 2, // 0 index MAR
      day: 30
    })).toBe(28);
    expect(previousRelativeMonthDay({
      year: 2018,
      month: 2, // 0 index MAR
      day: 31
    })).toBe(28);
    expect(previousRelativeMonthDay({
      year: 2018,
      month: 3, // 0 index APR
      day: 1
    })).toBe(1);
  });
});

describe('datePad', () => {
  test('should pad n with 0n', () => {
    expect(datePad(1)).toBe('01');
    expect(datePad(10)).toBe('10');
  })
});

describe('isUnsigned', ()=> {
  test('should be unsigned', () => {
    expect(isUnsigned(1)).toBe(true);
  });
  test('negative number should be signed', () => {
    expect(isUnsigned(-1)).toBe(false);
  });
  test('zero should be unsigned', () => {
    expect(isUnsigned(0)).toBe(true);
  });
  test('negative zero (not valid) should be unsigned', () => {
    expect(isUnsigned(-0)).toBe(true);
  });
})