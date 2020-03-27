export const hideText = (value) => {
  if (!value || value.length <= 5) {
    return value;
  }

  return value.substr(0, 3) + '*'.repeat(value.length - 5) + value.substr(-2);
};
