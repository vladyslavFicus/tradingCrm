import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as Loader } from './loader.svg';

const ShortLoader = ({ height }) => (
  <div className="u-center">
    <Loader height={height} />
  </div>
);

ShortLoader.propTypes = {
  height: PropTypes.number,
};

ShortLoader.defaultProps = {
  height: 25,
};

export default ShortLoader;
