import React from 'react';
import PropTypes from 'prop-types';
import { getActiveBrandConfig } from 'config';

/**
 * Check if brand with enabled regulation
 *
 * @param children
 * @return {*}
 * @constructor
 */
const Regulated = ({ children }) => (
  <If condition={getActiveBrandConfig().regulation.isActive}>
    {children}
  </If>
);

Regulated.propTypes = {
  children: PropTypes.node,
};

Regulated.defaultProps = {
  children: null,
};

export default Regulated;
