import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getLogo } from '../../config';

const Logo = ({ className, to }) => (
  <Link className={className} to={to}>
    <img
      src={getLogo()}
      alt="current-brand-logo"
      onError={(e) => { e.target.src = '/img/logo-placeholder.svg'; }}
    />
  </Link>
);

Logo.propTypes = {
  to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  className: PropTypes.string,
};

Logo.defaultProps = {
  className: null,
};

export default Logo;
