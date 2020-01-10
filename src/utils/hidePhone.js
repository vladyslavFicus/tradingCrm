export const hidePhone = (phone) => {
  if (!phone || phone.length <= 5) {
    return phone;
  }

  return phone.substr(0, 3) + '*'.repeat(phone.length - 5) + phone.substr(-2);
};
