import React from 'react';
import PropTypes from 'prop-types';
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
