import React, { PropTypes } from 'react';

const DropDownFilter = ({ name, items, onFilterChange }) => (
  <select
    className="form-control"
    onChange={(e) => onFilterChange({ [name]: e.target.value })}
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
