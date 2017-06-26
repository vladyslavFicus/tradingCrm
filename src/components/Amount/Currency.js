import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config/index';

const Currency = ({ code, ...rest }) => {
  let symbol = code;
  if (config.components.Currency.currencies[code]) {
    symbol = config.components.Currency.currencies[code];
  }

  return symbol ? <span {...rest}>{symbol}</span> : null;
};

Currency.propTypes = {
  code: PropTypes.string.isRequired,
};

export default Currency;
