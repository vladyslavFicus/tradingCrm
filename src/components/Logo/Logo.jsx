import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Logo = ({ className, to, brand }) => (
  <Link className={className} to={to}>
    <img
      src={`/img/brand/header/${brand}.svg`}
      alt="current-brand-logo"
      onError={(e) => { e.target.src = '/img/logo-placeholder.svg'; }}
    />
  </Link>
);

Logo.propTypes = {
  to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  className: PropTypes.string,
  brand: PropTypes.string,
};

Logo.defaultProps = {
  className: null,
  brand: '',
};

export default Logo;
