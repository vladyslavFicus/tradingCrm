import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash/omit';
import { Field } from 'redux-form';
import { withStyles, withStylesPropTypes, css } from 'react-with-styles';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { DateRangePickerPhrases } from 'react-dates/lib/defaultPhrases';
import { DateRangePickerShape, isInclusivelyAfterDay, isSameDay } from 'react-dates/lib';
import { START_DATE, END_DATE, HORIZONTAL_ORIENTATION, ANCHOR_LEFT } from 'react-dates/constants';

import DateRangePickerController from './DateRangePickerController';
import { presets } from './periodPresets';

const propTypes = {
  ...withStylesPropTypes,
  autoFocus: PropTypes.bool,
  autoFocusEndDate: PropTypes.bool,
  initialStartDate: momentPropTypes.momentObj,
  initialEndDate: momentPropTypes.momentObj,

  ...omit(DateRangePickerShape, [
    'startDate',
    'endDate',
    'change',
    'focusedInput',
    'onFocusChange',
  ]),

  withTime: PropTypes.bool,
  dateFormat: PropTypes.string,
};

const defaultProps = {
  autoFocus: false,
  autoFocusEndDate: false,
  initialStartDate: null,
  initialEndDate: null,
  startDateId: START_DATE,
  startDatePlaceholderText: 'Start Date',
  endDateId: END_DATE,
  endDatePlaceholderText: 'End Date',
  disabled: false,
  required: false,
  screenReaderInputMessage: '',
  showClearDates: false,
  showDefaultInputIcon: false,
  customInputIcon: null,
  customArrowIcon: null,
  customCloseIcon: null,
  block: false,
  small: false,
  renderMonth: null,
  orientation: HORIZONTAL_ORIENTATION,
  anchorDirection: ANCHOR_LEFT,
  horizontalMargin: 0,
  withPortal: false,
  withFullScreenPortal: false,
  initialVisibleMonth: null,
  numberOfMonths: 1,
  keepOpenOnDateSelect: false,
  reopenPickerOnClearDates: false,
  isRTL: false,
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},
  onClose() {},
  renderDay: null,
  minimumNights: 1,
  enableOutsideDays: false,
  isDayBlocked: () => false,
  isOutsideRange: day => !isInclusivelyAfterDay(day, moment()),
  isDayHighlighted: () => false,
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: 'MMMM YYYY',
  phrases: DateRangePickerPhrases,
  withTime: true,
  dateFormat: 'YYYY-MM-DD',
};

class DateRangePicker extends React.Component {
  constructor(props) {
    super(props);

    let focusedInput = null;
    if (props.autoFocus) {
      focusedInput = START_DATE;
    } else if (props.autoFocusEndDate) {
      focusedInput = END_DATE;
    }

    this.state = {
      focusedInput,
    };
  }

  componentDidMount() {
    this.onDatesChange({
      startDate: this.props.initialStartDate,
      endDate: this.props.initialEndDate,
    });
  }

  onDatesChange = ({ startDate, endDate }) => {
    const {
      change,
      periodKeys: {
        start: startKey,
        end: endKey,
      },
      withTime,
      dateFormat,
    } = this.props;

    this.setState({ startDate, endDate }, () => {
      let startFormat = dateFormat;
      let endFormat = dateFormat;

      if (withTime) {
        startFormat = `${startFormat}T00:00:00`;
        endFormat = `${endFormat}T23:59:59`;
      }

      const start = startDate ? startDate.format(startFormat) : '';
      const end = endDate ? endDate.format(endFormat) : '';

      change(startKey, start);
      change(endKey, end);
    });
  };

  onFocusChange = (focusedInput) => {
    this.setState({ focusedInput });
  };

  renderDatePresets = () => {
    const { startDate, endDate } = this.state;
    const { styles } = this.props;

    return (
      <div {...css(styles.PresetDateRangePicker_panel)}>
        {presets.map(({ text, start, end }) => {
          const isSelected = isSameDay(start, startDate) && isSameDay(end, endDate);
          return (
            <button
              key={text}
              {...css(
                styles.PresetDateRangePicker_button,
                isSelected && styles.PresetDateRangePicker_button__selected,
              )}
              type="button"
              onClick={() => this.onDatesChange({ startDate: start, endDate: end })}
            >
              {text}
            </button>
          );
        })}
      </div>
    );
  };

  render() {
    const { focusedInput, startDate, endDate } = this.state;
    const { periodKeys: { start, end } } = this.props;

    const props = omit(this.props, [
      'autoFocus',
      'autoFocusEndDate',
      'initialStartDate',
      'initialEndDate',
      'dateFormat',
      'change',
      'periodKeys',
      'withTime',
    ]);

    return (
      <div>
        <DateRangePickerController
          {...props}
          renderCalendarInfo={this.renderDatePresets}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
        />
        <Field
          name={start}
          component="input"
          hidden
        />
        <Field
          name={end}
          component="input"
          hidden
        />
      </div>
    );
  }
}

DateRangePicker.propTypes = propTypes;
DateRangePicker.defaultProps = defaultProps;

export default withStyles(({ reactDates: { color } }) => ({
  PresetDateRangePicker_panel: {
    padding: '0 22px 11px 22px',
  },

  PresetDateRangePicker_button: {
    position: 'relative',
    height: '100%',
    textAlign: 'center',
    background: 'none',
    border: `2px solid ${color.core.primary}`,
    color: color.core.primary,
    padding: '4px 12px',
    marginRight: 8,
    font: 'inherit',
    fontWeight: 700,
    lineHeight: 'normal',
    overflow: 'visible',
    boxSizing: 'border-box',
    cursor: 'pointer',

    ':active': {
      outline: 0,
    },
  },

  PresetDateRangePicker_button__selected: {
    color: color.core.white,
    background: color.core.primary,
  },
}))(DateRangePicker);
