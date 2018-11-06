export default (data) => {
  const formData = new FormData();

  for (let key in data) {
    formData.set(key, data[key]);
  }

  return formData;
};
