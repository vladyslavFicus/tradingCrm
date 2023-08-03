import { getCountryCode } from 'utils/countryList';

const useCountryLabelWithFlag = (code?: string | null) => {
  const countryCode = code ? getCountryCode(code) : '';

  return {
    countryCode,
  };
};

export default useCountryLabelWithFlag;
