import countryList from 'country-list';

const countries = countryList().getData().reduce((country, item) => ({
  ...country,
  [item.code]: item.name,
}), {});

export { countries };
