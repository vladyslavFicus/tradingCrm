import { get } from 'lodash';
import { getBrand } from 'config';
import { accountTypes } from 'constants/accountTypes';
import { platformTypes } from 'constants/platformTypes';

/**
 * Get available platform types for current brand depends on brand config
 *
 * @return {*[]}
 */
const getAvailablePlatformTypes = () => {
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
const getAvailableAccountTypes = (_platformType) => {
  const brand = getBrand();
  const platformType = _platformType.toLowerCase();

  return accountTypes.filter(({ value: _accountType }) => {
    const accountType = _accountType.toLowerCase();

    return get(brand, `${platformType}.${accountType}.enabled`);
  });
};

/**
 * Get label for platform type
 *
 * @param platformType
 *
 * @return {*}
 */
const getPlatformTypeLabel = platformType => platformTypes.find(({ value }) => platformType === value)?.label;

export {
  getAvailablePlatformTypes,
  getAvailableAccountTypes,
  getPlatformTypeLabel,
};
