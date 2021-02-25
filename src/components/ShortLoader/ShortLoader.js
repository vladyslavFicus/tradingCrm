import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ReactComponent as ShortLoaderIcon } from './ShortLoader.svg';
import './ShortLoader.scss';

const ShortLoader = ({ height, className }) => (
  <div className={classNames('ShortLoader', className)}>
    <ShortLoaderIcon height={height} />
  </div>
);

ShortLoader.propTypes = {
  height: PropTypes.number,
  className: PropTypes.string,
};

ShortLoader.defaultProps = {
  height: 25,
  className: null,
};

export default ShortLoader;
