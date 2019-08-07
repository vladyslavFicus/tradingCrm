export default (data) => {
  const formData = new window.FormData();

  Object.keys(data).forEach((key) => {
    formData.set(key, data[key]);
  });

  return formData;
};
