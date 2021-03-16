import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
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
    selectedDateRange: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    handleAdditionalClick: PropTypes.func.isRequired,
    withAdditionalOptions: PropTypes.bool.isRequired,
    withAdditionalValues: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    selectedAdditional: null,
    additionalOptions: null,
    additionalValues: null,
    selectedDateRange: null,
  };

  renderAdditionalItems = (additionalItems, isAdditionalOption) => {
    const {
      handleAdditionalClick,
      selectedAdditional,
      selectedDateRange: {
        from,
        to,
      },
    } = this.props;

    return additionalItems.map((item) => {
      const isMatchedRange = isAdditionalOption
        && moment(item?.value?.from).isSame(from, 'minute')
        && moment(item?.value?.to).isSame(to, 'minute');

      return (
        <div
          key={item.label}
          className={classNames('DatePickerAdditional__item', {
            'DatePickerAdditional__item--selected': isEqual(item, selectedAdditional) || isMatchedRange,
          })}
          onClick={() => handleAdditionalClick(item, isAdditionalOption)}
        >
          {I18n.t(item.label)}
        </div>
      );
    });
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
          <If condition={withAdditionalOptions && additionalOptions?.length}>
            {this.renderAdditionalItems(additionalOptions, true)}
          </If>
          <If condition={withAdditionalValues && additionalValues?.length}>
            {this.renderAdditionalItems(additionalValues, false)}
          </If>
        </div>
      </div>
    );
  }
}

export default DatePickerAdditional;
