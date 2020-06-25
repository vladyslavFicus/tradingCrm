import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import I18n from 'i18n-js';
import DatePicker from 'components/DatePicker';
import { RangeGroup } from 'components/Forms';

const ISO_FORMAT_DATE = 'YYYY-MM-DD';
const ISO_FORMAT_TIME = 'HH:mm:ss';

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
    }).isRequired,
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
  };

  startDateValidator = (current) => {
    const { endField: { value } } = this.props;

    return value
      ? current.isSameOrBefore(moment(value))
      : current.isSameOrBefore(moment());
  };

  endDateValidator = (current) => {
    const { startField: { value } } = this.props;

    return value
      ? current.isSameOrAfter(moment(value))
      : true;
  };

  correctEndDate = () => {
    const {
      utc,
      startField: { value: startValue },
      endField,
      endField: { value: endValue },
    } = this.props;

    if (utc && startValue && endValue && moment(endValue).isSame(startValue)) {
      return {
        ...endField,
        value: moment
          .utc(endValue)
          .local()
          .set({ hour: '23', minute: '59', second: '59' })
          .utc()
          .format(`${ISO_FORMAT_DATE}T${ISO_FORMAT_TIME}`), // it's important to set initial format
      };
    }
    return endField;
  }

  render() {
    const {
      className,
      startPickerClassName,
      endPickerClassName,
      label,
      startField,
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
          timePresets={timePresets}
          closeOnSelect={closeOnSelect}
        />
        <DatePicker
          pickerClassName={endPickerClassName}
          field={this.correctEndDate()}
          isValidDate={this.endDateValidator}
          placeholder={I18n.t('COMMON.DATE_OPTIONS.END_DATE')}
          utc={utc}
          withTime={withTime}
          timePresets={timePresets}
          closeOnSelect={closeOnSelect}
          isDateRangeEndValue
        />
      </RangeGroup>
    );
  }
}

export default DateRangeGroup;
