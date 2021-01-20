import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { isEqual } from 'lodash';
import './DatePickerAdditional.scss';

class DatePickerAdditional extends PureComponent {
  static propTypes = {
    additionalOptions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    })),
    additionalValues: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    })),
    selectedAdditional: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    }),
    handleAdditionalClick: PropTypes.func.isRequired,
    withAdditionalOptions: PropTypes.bool.isRequired,
    withAdditionalValues: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    selectedAdditional: null,
    additionalOptions: null,
    additionalValues: null,
  };

  renderAdditionalItems = (additionalItems, isAdditionalOption) => {
    const {
      handleAdditionalClick,
      selectedAdditional,
    } = this.props;

    return additionalItems.map(item => (
      <div
        key={item.label}
        className={classNames('DatePickerAdditional__item', {
          'DatePickerAdditional__item--selected': isEqual(item, selectedAdditional),
        })}
        onClick={() => handleAdditionalClick(item, isAdditionalOption)}
      >
        {I18n.t(item.label)}
      </div>
    ));
  }

  render() {
    const {
      additionalValues,
      additionalOptions,
      withAdditionalValues,
      withAdditionalOptions,
    } = this.props;

    return (
      <div className="DatePickerAdditional">
        <div className="DatePickerAdditional__items">
          <If condition={withAdditionalValues && additionalValues?.length}>
            {this.renderAdditionalItems(additionalValues, false)}
          </If>

          <If condition={withAdditionalOptions && additionalOptions?.length}>
            {this.renderAdditionalItems(additionalOptions, true)}
          </If>
        </div>
      </div>
    );
  }
}

export default DatePickerAdditional;
