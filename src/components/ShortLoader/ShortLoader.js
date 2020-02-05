import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as ShortLoaderIcon } from './ShortLoader.svg';
import './ShortLoader.scss';

const ShortLoader = ({ height }) => (
  <div className="ShortLoader">
    <ShortLoaderIcon height={height} />
  </div>
);

ShortLoader.propTypes = {
  height: PropTypes.number,
};

ShortLoader.defaultProps = {
  height: 25,
};

export default ShortLoader;
