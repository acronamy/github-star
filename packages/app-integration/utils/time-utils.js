const { isUnsigned } = require("./format-utils");


/*
* @private
* @param {number} month from 1 index where JAN is 1
* If no params, defaults to this month.
*/
function getMonthLength({year, month}) {
  return new Date(year, month, 0).getDate();
}

/*
* @private
* @param {number} any day as a number signed or unsigned
* @param {number} month from 0 index where JAN is 0
* @param {number} year as a number
* If no params, defaults to this month.
*/
function daysUntilMonthEnd({year, month, day}) {
  const monthLength = getMonthLength({year, month: month + 1});
  return day - monthLength;
}

/*
* @param {number} any day as a number signed or unsigned
* @param {number} month from 1 index where JAN is 1
* @param {number} year as a number
* year is corrected by timetravel back one month
*/
function previousRelativeMonthDay ({year, month, day}) {
  const MONTH_MAX = 12;
  let previousMonth;
  previousMonth = (month - 1) === 0 ? MONTH_MAX : month - 1;
  // previous month can never be hit unless decrementing
  if (previousMonth === MONTH_MAX) {
    year -= 1;
  }
  // calculate month, if number is negative then the 28th exists in this previous month,
  // if positive then that is the amount to keep reporting the last day of previous mounth until we can roll over the the first
  const untilTheFirst = daysUntilMonthEnd({
    year,
    month: previousMonth,
    day,
  });
  if (isUnsigned(untilTheFirst)) {
    // this will return the last day of the given month until a common date number is found
    return getMonthLength({year, month: previousMonth + 1});
  }
  else {
    return day;
  }
}

/**
* @param {n} n number to be padded with preceding 0 if not in the 10s
*/
function datePad (n) {
 return n.toString().padStart(2).replace(/\s/g, '0');
}

module.exports = {
  getMonthLength,
  daysUntilMonthEnd,
  previousRelativeMonthDay,
  datePad
}