/**
 * Get step by count of symbols after dot
 *
 * @param digits
 */
export const step = (digits: number) => (digits > 0 ? `0.${'0'.repeat(digits - 1)}1` : '0');

/**
 * Get placeholder by count of digits after dot
 *
 * @param digits
 */
export const placeholder = (digits: number) => (digits > 0 ? `0.${'0'.repeat(digits)}` : '0');
