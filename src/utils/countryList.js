import countryList from 'country-list';

export default countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});
