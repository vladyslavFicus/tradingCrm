import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { isEqual } from 'lodash';
import './DatePickerAdditionalOptions.scss';

class DatePickerAdditionalOptions extends PureComponent {
  static propTypes = {
    additionalOptions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    })).isRequired,
    selectedAdditionalOption: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    }),
    handleAdditionalClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedAdditionalOption: null,
  };

  render() {
    const {
      additionalOptions,
      handleAdditionalClick,
      selectedAdditionalOption,
    } = this.props;

    return (
      <div className="DatePickerAdditionalOptions">
        <div className="DatePickerAdditionalOptions__items">
          {additionalOptions.map(option => (
            <div
              key={option.label}
              className={classNames('DatePickerAdditionalOptions__item', {
                'DatePickerAdditionalOptions__item--selected': isEqual(option, selectedAdditionalOption),
              })}
              onClick={() => handleAdditionalClick(option)}
            >
              {I18n.t(option.label)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default DatePickerAdditionalOptions;
