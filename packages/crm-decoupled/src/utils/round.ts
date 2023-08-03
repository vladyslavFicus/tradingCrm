/**
 * Rounding number to count of decimals
 *
 * @param number
 * @param decimals
 *
 * @return {number}
 */
export const round = (number: number, decimals = 0): number => (
  Number.isFinite(number) ? Number(number.toFixed(decimals)) : 0
);
