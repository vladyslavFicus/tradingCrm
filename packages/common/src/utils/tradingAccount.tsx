import { get } from 'lodash';
import { accountTypes } from '../constants/accountTypes';
import { platformTypes } from '../constants/platformTypes';
import { getBrand } from '../config';

/**
 * Get available platform types for current brand depends on brand config
 *
 * @return {*[]}
 */
export const getAvailablePlatformTypes = () => {
  const brand = getBrand();

  return platformTypes.filter(({ value: _platformType }) => {
    const platformType = _platformType.toLowerCase();

    // Check if event one from account types is available for platform type
    return accountTypes.some(({ value: _accountType }) => {
      const accountType = _accountType.toLocaleLowerCase();

      return get(brand, `${platformType}.${accountType}.enabled`);
    });
  });
};

/**
 * Get available account types for specific platform type of current brand depends on brand config
 *
 * @return {*[]}
 */
export const getAvailableAccountTypes = (_platformType: string) => {
  const brand = getBrand();
  const platformType = _platformType.toLowerCase();

  return accountTypes.filter(({ value: _accountType }) => {
    const accountType = _accountType.toLowerCase();

    return get(brand, `${platformType}.${accountType}.enabled`);
  });
};

/**
 * Get plarform supported currencies
 *
 * @param platformType
 *
 * @return {Array<string>}
 */
export const getPlarformSupportedCurrencies = (platformType: string): Array<string> => {
  const brand = getBrand();
  return brand[platformType.toLowerCase()]?.currencies?.supported || brand.currencies.supported;
};

/**
 * Get plarform default currency
 *
 * @param platformType
 *
 * @return {string}
 */
export const getPlatformDefaultCurrency = (platformType: string): string => {
  const brand = getBrand();
  return brand[platformType.toLowerCase()]?.currencies?.default || brand.currencies.base;
};

/**
 * Get label for platform type
 *
 * @param platformType
 *
 * @return {*}
 */
export const getPlatformTypeLabel = (platformType: string) => (
  platformTypes.find(({ value }) => platformType === value)?.label || ''
);
