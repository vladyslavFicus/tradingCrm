/**
 * Capitalize first letter of string
 *
 * Example:
 *
 * ADMINISTRATION --> Administration
 * administration --> Administration
 * aDMIniStrAtiOn --> Administration
 *
 * @param string
 *
 * @return {string}
 */
module.exports = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
