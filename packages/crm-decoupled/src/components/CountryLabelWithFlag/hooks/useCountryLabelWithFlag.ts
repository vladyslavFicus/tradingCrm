import { Utils } from '@crm/common';

const useCountryLabelWithFlag = (code?: string | null) => {
  const countryCode = code ? Utils.getCountryCode(code) : '';

  return {
    countryCode,
  };
};

export default useCountryLabelWithFlag;
