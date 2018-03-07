export default (list, currency, defaultValue = null) => {
  if (Array.isArray(list) && list.length > 0) {
    const money = list.find(c => c.currency === currency);

    if (money) {
      return money.amount;
    }
  }

  return defaultValue;
};
