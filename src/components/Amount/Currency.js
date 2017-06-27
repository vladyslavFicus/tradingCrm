import React from 'react';
import PropTypes from 'prop-types';
import { currencySettings as currencies } from './constants';

const Currency = ({ code, ...rest }) => {
  let symbol = code;
  if (currencies[code]) {
    symbol = currencies[code].symbol;
  }

  return <span {...rest}>{symbol}</span>;
};

Currency.propTypes = {
  code: PropTypes.string.isRequired,
};

export default Currency;
