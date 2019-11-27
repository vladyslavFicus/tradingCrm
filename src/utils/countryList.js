import countryList from 'country-list';

const countryCodeSource = {
  EN: 'GB',
  UK: 'GB',
  ENG: 'GB_ENG',
  ZH: 'CN',
};

export const getCountryCode = (value) => {
  const code = value && value.toUpperCase();
  return countryCodeSource[code] || code;
};

export default countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});
