import { getActiveBrandConfig } from 'config';
import { accountTypes } from 'constants/accountTypes';
import { platformTypes } from 'constants/platformTypes';

/**
 * Get available platform types for current brand depends on brand config
 *
 * @return {*[]}
 */
const getAvailablePlatformTypes = () => {
  const {
    isMT4LiveAvailable,
    isMT4DemoAvailable,
    isMT5LiveAvailable,
    isMT5DemoAvailable,
  } = getActiveBrandConfig();

  return platformTypes.filter(({ value }) => {
    if (value === 'MT4') {
      return isMT4LiveAvailable || isMT4DemoAvailable;
    }

    if (value === 'MT5') {
      return isMT5LiveAvailable || isMT5DemoAvailable;
    }

    return false;
  });
};

/**
 * Get available account types for specific platform type of current brand depends on brand config
 *
 * @return {*[]}
 */
const getAvailableAccountTypes = (platformType) => {
  const {
    isMT4LiveAvailable,
    isMT4DemoAvailable,
    isMT5LiveAvailable,
    isMT5DemoAvailable,
  } = getActiveBrandConfig();

  return accountTypes.filter(({ value }) => {
    if (platformType === 'MT4' && value === 'LIVE') {
      return isMT4LiveAvailable;
    }

    if (platformType === 'MT4' && value === 'DEMO') {
      return isMT4DemoAvailable;
    }

    if (platformType === 'MT5' && value === 'LIVE') {
      return isMT5LiveAvailable;
    }

    if (platformType === 'MT5' && value === 'DEMO') {
      return isMT5DemoAvailable;
    }

    return false;
  });
};

export {
  getAvailablePlatformTypes,
  getAvailableAccountTypes,
};
