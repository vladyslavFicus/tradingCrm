import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import Input from 'components/Input';
import './FilterSetsSearch.scss';

class FilterSetsSearch extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: '',
  };

  render() {
    const {
      value,
      onChange,
      onReset,
    } = this.props;

    return (
      <div className="FilterSetsSearch">
        <div className="FilterSetsSearch__field-wrapper">
          <Input
            type="text"
            name="FilterSetsSearch"
            value={value}
            onChange={onChange}
            className="FilterSetsSearch__field"
            placeholder={I18n.t('common.select.default_placeholder')}
            addition={<i className="icon icon-search" />}
          />
          <If condition={value}>
            <i
              className="FilterSetsSearch__reset-icon icon icon-times"
              onClick={onReset}
            />
          </If>
        </div>
      </div>
    );
  }
}

export default FilterSetsSearch;
