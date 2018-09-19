const countryCodeSource = {
  UK: 'GB',
  ENG: 'GB_ENG',
};

export default (value) => {
  const code = value.toUpperCase();
  return countryCodeSource[code] || code;
};
