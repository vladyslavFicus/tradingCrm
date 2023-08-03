import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { differenceWith, isEqual } from 'lodash';
import './SelectSearchBox.scss';

class SelectSearchBox extends PureComponent {
  static propTypes = {
    placeholder: PropTypes.string,
    query: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    placeholder: null,
    query: '',
  };

  focus() {
    this.input.focus();
  }

  render() {
    const { placeholder, query, onChange } = this.props;

    return (
      <div className="SelectSearchBox">
        <i className="icon icon-search SelectSearchBox__icon-left" />
        <input
          type="text"
          className="SelectSearchBox__input"
          placeholder={placeholder || I18n.t('common.select.default_placeholder')}
          onChange={onChange}
          value={query}
          ref={(input) => { this.input = input; }}
          tabIndex={-1}
        />
        <If condition={!!query}>
          <i className="icon icon-times SelectSearchBox__icon-right" onClick={() => onChange(null)} />
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

  return options.filter(({ label, props: { search } }) => {
    const searchBy = search || label;

    return searchBy.toLowerCase().indexOf(lowerCasedQuery) > -1;
  });
};

const filterOptionsByQueryWithMultiple = (query, options, originalSelectedOptions) => {
  const _filterOptionsByQuery = filterOptionsByQuery(query, options);

  return differenceWith(_filterOptionsByQuery, originalSelectedOptions, isEqual);
};

export { filterOptionsByQuery, filterOptionsByQueryWithMultiple };

export default SelectSearchBox;
