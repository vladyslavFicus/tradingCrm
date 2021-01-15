import countryList from 'country-list';

const countryCodeSource = {
  EN: 'GB',
  UK: 'GB',
  ENG: 'GB_ENG',
  ZH: 'CN',
};

const unknownCountryCodeSource = [
  'UNDEFINED',
];

export const getCountryCode = (value) => {
  const code = value && value.toUpperCase();
  return countryCodeSource[code] || unknownCountryCodeSource.includes(code) ? undefined : code;
};

export default countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});
