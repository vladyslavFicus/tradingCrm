import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SelectSearchBox = (props) => {
  const { placeholder, query, onChange } = props;
  const className = classNames('select-search-bar input-with-icon input-with-icon__left', {
    'input-with-icon__right': !!query,
  });

  return (
    <div className={className}>
      <i className="nas nas-search_icon input-left-icon" />
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        onChange={onChange}
        value={query}
      />
      {!!query && <i className="nas nas-clear_icon input-right-icon" onClick={() => onChange(null)} />}
    </div>
  );
};
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
