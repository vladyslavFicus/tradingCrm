import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import DatePicker from 'components/DatePicker';
import { RangeGroup } from 'components/Forms';

class DateRangeGroup extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    startPickerClassName: PropTypes.string,
    endPickerClassName: PropTypes.string,
    label: PropTypes.string,
    startField: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
    }).isRequired,
    endField: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
      setValue: PropTypes.func,
    }).isRequired,
    isFocusedStartField: PropTypes.bool,
    isFocusedEndField: PropTypes.bool,
    utc: PropTypes.bool,
    withTime: PropTypes.bool,
    timePresets: PropTypes.bool,
    closeOnSelect: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    startPickerClassName: 'left-side',
    endPickerClassName: '',
    label: '',
    utc: true,
    withTime: true,
    timePresets: true,
    closeOnSelect: false,
    isFocusedEndField: false,
    isFocusedStartField: false,
  };

  /**
   *
   * @param current : _isUTC: false
   */
  startDateValidator = (current) => {
    const { utc, endField: { value } } = this.props;

    const formatedValue = utc ? moment.utc(value).local() : moment(value);

    return value
      ? current.isSameOrBefore(formatedValue, 'day')
      : current.isSameOrBefore(moment());
  };

  /**
   *
   * @param current : _isUTC: false
   */
  endDateValidator = (current) => {
    const { utc, startField: { value } } = this.props;

    const formatedValue = utc ? moment.utc(value).local() : moment(value);

    return value
      ? current.isSameOrAfter(formatedValue, 'day')
      : true;
  };

  render() {
    const {
      className,
      startPickerClassName,
      endPickerClassName,
      label,
      isFocusedStartField,
      isFocusedEndField,
      startField,
      endField,
      utc,
      withTime,
      timePresets,
      closeOnSelect,
    } = this.props;

    return (
      <RangeGroup
        className={className}
        label={label}
      >
        <DatePicker
          pickerClassName={startPickerClassName}
          field={startField}
          isValidDate={this.startDateValidator}
          placeholder={I18n.t('COMMON.DATE_OPTIONS.START_DATE')}
          utc={utc}
          withTime={withTime}
          isFocused={isFocusedStartField}
          timePresets={timePresets}
          closeOnSelect={closeOnSelect}
        />
        <DatePicker
          pickerClassName={endPickerClassName}
          field={endField}
          isValidDate={this.endDateValidator}
          placeholder={I18n.t('COMMON.DATE_OPTIONS.END_DATE')}
          utc={utc}
          withTime={withTime}
          isFocused={isFocusedEndField}
          timePresets={timePresets}
          closeOnSelect={closeOnSelect}
          isDateRangeEndValue
        />
      </RangeGroup>
    );
  }
}

export default DateRangeGroup;
