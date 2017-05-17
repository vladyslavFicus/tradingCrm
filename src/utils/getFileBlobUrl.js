export default async (url, options) => {
  const response = await fetch(url, options);

  return window.URL.createObjectURL(await response.blob());
};
