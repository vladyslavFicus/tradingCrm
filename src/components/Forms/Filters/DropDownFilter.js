import React from 'react';
import PropTypes from 'prop-types';

const DropDownFilter = ({ name, items, onFilterChange, ...rest }) => (
  <select
    className="form-control"
    onChange={(e) => onFilterChange({ [name]: e.target.value })}
    {...rest}
  >
    {Object.keys(items).map((key) => <option key={key} value={key}>{items[key]}</option>)}
  </select>
);

DropDownFilter.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default DropDownFilter;
