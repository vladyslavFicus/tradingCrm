import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SelectSearchBox.scss';

class SelectSearchBox extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    query: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {
    placeholder: 'Search',
    query: '',
  };

  render() {
    const { placeholder, query, onChange } = this.props;

    return (
      <div className="select-search-box">
        <i className="icon icon-search select-search-box__icon-left" />
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          onChange={onChange}
          value={query}
        />
        <If condition={!!query}>
          <i className="icon icon-times select-search-box__icon-right" onClick={() => onChange(null)} />
        </If>
      </div>
    );
  }
}

const filterOptionsByQuery = (query, options) => {
  if (query === '') {
    return options;
  }
  const lowerCasedQuery = query.toLowerCase();

  return options.filter(option => option.label.toLowerCase().indexOf(lowerCasedQuery) > -1);
};

export { filterOptionsByQuery };

export default SelectSearchBox;
