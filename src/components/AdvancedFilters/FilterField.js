import React from 'react';
import PropTypes from 'prop-types';
import { SIZES, TYPES } from './constants';

const FilterField = ({ children }) => children;
FilterField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default FilterField;
