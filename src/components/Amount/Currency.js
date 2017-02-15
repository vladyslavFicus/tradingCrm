import React, { Component, PropTypes } from 'react';
import config from 'config/index';

const Currency = ({ code, ...rest }) => {
  const { symbol } = config.components.Currency.currencies[code];

  return symbol ? <span {...rest}>{symbol}</span> : null;
};

Currency.propTypes = {
  code: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Currency;
