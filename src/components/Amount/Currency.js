import React from 'react';
import PropTypes from 'prop-types';
import { currencySettings as currencies } from './constants';
import './Currency.scss';

const Currency = ({ code, showSymbol, ...rest }) => {
  let symbol = code;
  if (showSymbol && currencies[code]) {
    ({ symbol } = currencies[code]);
  }

  return <span className="Currency__symbol" {...rest}>{symbol}</span>;
};

Currency.propTypes = {
  code: PropTypes.string.isRequired,
  showSymbol: PropTypes.bool,
};

Currency.defaultProps = {
  showSymbol: true,
};

export default Currency;
