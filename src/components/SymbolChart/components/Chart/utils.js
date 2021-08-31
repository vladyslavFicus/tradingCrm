/**
  * Formatting time for tradingView chart
  *
  * @param time String
  *
  * @return Int Timestamp
*/
export const chartTimeFormatting = time => (new Date(time).getTime() / 1000);

/**
  * How much numbers after dot
  *
  * @param value Float
  *
  * @return Int
*/
export const decimalCount = (number) => {
  const numberAsString = number.toString();

  // String Contains Decimal
  if (numberAsString.includes('.')) {
    return numberAsString.split('.')[1].length;
  }
  // String Does Not Contain Decimal
  return 0;
};

/**
  * Count precision and minMove
  *
  * @param ask Array
  * @param bid Array
  *
  * @return Object
*/
export const countPrecisionAndMinMove = (ask, bid) => {
  const maxAskValueAfterDot = Math.max(...ask.map(({ value }) => decimalCount(value)));
  const maxBidValueAfterDot = Math.max(...bid.map(({ value }) => decimalCount(value)));
  const maxValue = Math.max(maxAskValueAfterDot, maxBidValueAfterDot);

  if (maxValue && Number.isFinite(maxValue)) {
    return {
      minMove: (parseFloat(0).toFixed(maxValue - 1) + 1),
      precision: maxValue,
    };
  }

  return {};
};
