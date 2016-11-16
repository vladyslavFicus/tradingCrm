import React, { PropTypes } from 'react';

const TextFilter = ({ name, onFilterChange }) => (
  <input
    type="text"
    className="form-control"
    onChange={(e) => onFilterChange({ [name]: e.target.value })}
  />
);

TextFilter.propTypes = {
  name: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default TextFilter;
