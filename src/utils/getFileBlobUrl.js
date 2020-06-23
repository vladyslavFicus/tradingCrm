import fetch from './fetch';

export default async (url, options) => {
  const response = await fetch(url, options);

  return URL.createObjectURL(await response.blob());
};
