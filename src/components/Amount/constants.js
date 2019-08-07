import keyMirror from 'keymirror';

const currencyCodes = keyMirror({
  EUR: null,
  USD: null,
  RUB: null,
  UAH: null,
  GBP: null,
  SEK: null,
  NOK: null,
});

const currencySettings = {
  [currencyCodes.EUR]: { symbol: '€', symbolOnLeft: true },
  [currencyCodes.USD]: { symbol: '$', symbolOnLeft: true },
  [currencyCodes.RUB]: { symbol: '₽', symbolOnLeft: true },
  [currencyCodes.UAH]: { symbol: '₴', symbolOnLeft: true },
  [currencyCodes.GBP]: { symbol: '£', symbolOnLeft: true },
  [currencyCodes.SEK]: { symbol: 'SEK', symbolOnLeft: false },
  [currencyCodes.NOK]: { symbol: 'NOK', symbolOnLeft: false },
};

export {
  currencyCodes,
  currencySettings,
};
