/**
 * Rounding number to count of decimals
 *
 * @param number
 * @param decimals
 *
 * @return {number}
 */
export const round = (number, decimals = 0) => Number(number.toFixed(decimals));
