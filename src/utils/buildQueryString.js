export default params => Object
  .keys(params)
  .filter(value => params[value] !== '')
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  .join('&');
