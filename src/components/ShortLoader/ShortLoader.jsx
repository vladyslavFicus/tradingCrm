import React from 'react';
import PropTypes from 'prop-types';

const ShortLoader = ({ height }) => (
  <div className="text-center">
    <img src="/img/infinite_preloader.svg" alt="preloader" height={height} />
  </div>
);
ShortLoader.propTypes = {
  height: PropTypes.number,
};
ShortLoader.defaultProps = {
  height: 27,
};

export default ShortLoader;
