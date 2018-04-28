import React from 'react';
import PropTypes from 'prop-types';
import './SelectSearchBox.scss';

const SelectSearchBox = ({ placeholder, query, onChange }) => (
  <div className="select-search-box">
    <i className="nas nas-search_icon select-search-box__icon-left" />
    <input
      type="text"
      className="form-control"
      placeholder={placeholder}
      onChange={onChange}
      value={query}
    />
    <If condition={!!query}>
      <i className="nas nas-clear_icon select-search-box__icon-right" onClick={() => onChange(null)} />
    </If>
  </div>
);

SelectSearchBox.propTypes = {
  placeholder: PropTypes.string,
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
SelectSearchBox.defaultProps = {
  placeholder: 'Search',
  query: '',
};

const filterOptionsByQuery = (query, options) => {
  if (query === '') {
    return options;
  }
  const lowerCasedQuery = query.toLowerCase();

  return options.filter(option => option.label.toLowerCase().indexOf(lowerCasedQuery) > -1);
};

export { filterOptionsByQuery };

export default SelectSearchBox;
