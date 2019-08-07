export default params => Object
  .keys(params)
  .filter(value => params[value] !== '')
  .map((key) => {
    const value = params[key];

    if (typeof value === 'object') {
      return Object
        .keys(value)
        .map(val => (
          `${encodeURIComponent(key)}${Array.isArray(value) ? '' : `[${val}]`}=${encodeURIComponent(value[val])}`
        )).join('&');
    }

    return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  })
  .join('&');
