import countryList from 'country-list';

const countryCodeSource = {
  EN: 'GB',
  UK: 'GB',
  ENG: 'GB_ENG',
  ZH: 'CN',
  ZR: 'CD',
  SF: 'FI',
  BU: 'MM',
  TP: 'TL',
};

const unknownCountryCodeSource = [
  'UNDEFINED',
];

export const getCountryCode = (value) => {
  const code = value && value.toUpperCase();

  return unknownCountryCodeSource.includes(code) ? undefined : countryCodeSource[code] || code;
};

export default countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});
