import React from 'react';
import PropTypes from 'prop-types';

const Preloader = ({ show }) => (
  <div className="preloader" style={{ display: show ? 'block' : 'none' }}>
    <div className="loader" />
  </div>
);
Preloader.propTypes = {
  show: PropTypes.bool,
};
Preloader.defaultProps = {
  show: false,
};

export default Preloader;
