import React, { Component, PropTypes } from 'react';

const currenciesConfig = {
  EUR: {
    symbol: '€',
    symbolOnLeft: false,
  },
  USD: {
    symbol: '$',
    symbolOnLeft: true,
  },
  RUB: {
    symbol: '₽',
    symbolOnLeft: false,
  },
  UAH: {
    symbol: '₴',
    symbolOnLeft: false,
  },
  GBP: {
    symbol: '£',
    symbolOnLeft: true,
  },
  SEK: {
    symbol: 'kr',
    symbolOnLeft: false,
  },
  NOK: {
    symbol: 'kr',
    symbolOnLeft: false,
  },
};

const Currency = ({ code, ...rest }) => {
  const { symbol } = currenciesConfig[code];

  return symbol ? <span {...rest}>{symbol}</span> : null;
};

Currency.propTypes = {
  code: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export {
  currenciesConfig,
};

export default Currency;
