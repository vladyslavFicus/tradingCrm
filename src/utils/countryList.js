import countryList from 'country-list';

const countryCodeSource = {
  UK: 'GB',
  ENG: 'GB_ENG',
};

export const getCountryCode = (value) => {
  const code = value.toUpperCase();
  return countryCodeSource[code] || code;
};

export default countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});
