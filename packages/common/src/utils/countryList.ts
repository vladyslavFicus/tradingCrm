import countryList from 'country-list';

type Country = Record<string, string>;

const countryCodeSource: Country = {
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

export const getCountryCode = (value: string) => {
  const code = value && value.toUpperCase();

  return unknownCountryCodeSource.includes(code) ? undefined : countryCodeSource[code] || code;
};

export default countryList().getData().reduce<Country>((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});
