const DEFAULT_DIGITS = 4;

/**
 * Get step by count of symbols after dot
 *
 * @param digits
 */
export const step = (digits: number) => `0.${'0'.repeat(digits - 1 || DEFAULT_DIGITS)}1`;

/**
 * Get placeholder by count of digits after dot
 *
 * @param digits
 */
export const placeholder = (digits: number) => `0.${'0'.repeat(digits || DEFAULT_DIGITS)}`;
