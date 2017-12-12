import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash/omit';
import { withStyles, withStylesPropTypes, css } from 'react-with-styles';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import DateRangePicker from './ReactDates/components/DateRangePicker';
import toISODateString from './ReactDates/utils/toISODateString';

import { DateRangePickerPhrases } from './ReactDates/defaultPhrases';
import DateRangePickerShape from './ReactDates/shapes/DateRangePickerShape';
import { START_DATE, END_DATE, HORIZONTAL_ORIENTATION, ANCHOR_LEFT } from './ReactDates/constants';
import isInclusivelyAfterDay from './ReactDates/utils/isInclusivelyAfterDay';
import isSameDay from './ReactDates/utils/isSameDay';

const propTypes = {
  ...withStylesPropTypes,
  // example props for the demo
  autoFocus: PropTypes.bool,
  autoFocusEndDate: PropTypes.bool,
  initialStartDate: momentPropTypes.momentObj,
  initialEndDate: momentPropTypes.momentObj,

  ...omit(DateRangePickerShape, [
    'startDate',
    'endDate',
    'onDatesChange',
    'focusedInput',
    'onFocusChange',
  ]),
};

const today = moment();

const presets = [{
  text: 'Previous week',
  start: moment().subtract(1, 'weeks').startOf('isoWeek'),
  end: moment().subtract(1, 'weeks').endOf('isoWeek'),
},
{
  text: 'This week',
  start: moment().startOf('isoWeek'),
  end: moment().endOf('isoWeek'),
},
{
  text: 'Previous month',
  start: moment().subtract(1, 'months').startOf('month'),
  end: moment().subtract(1, 'months').endOf('month'),
},
{
  text: 'This month',
  start: moment().startOf('month'),
  end: moment().endOf('month'),
},
{
  text: 'Last 7 days',
  start: moment().subtract(7, 'days'),
  end: today,
},
{
  text: 'Last 14 days',
  start: moment().subtract(14, 'days'),
  end: today,
},
{
  text: 'This year',
  start: moment().startOf('year'),
  end: moment().endOf('year'),
},
];

const defaultProps = {
  // example props for the demo
  autoFocus: false,
  autoFocusEndDate: false,
  initialStartDate: null,
  initialEndDate: null,

  // input related props
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

  // calendar presentation and interaction related props
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

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},
  onClose() {},

  // day presentation and interaction related props
  renderDay: null,
  minimumNights: 1,
  enableOutsideDays: false,
  isDayBlocked: () => false,
  isOutsideRange: day => !isInclusivelyAfterDay(day, moment()),
  isDayHighlighted: () => false,

  // internationalization
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: 'MMMM YYYY',
  phrases: DateRangePickerPhrases,
};

class DateRangePickerWrapper extends React.Component {
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
      startDate: props.initialStartDate,
      endDate: props.initialEndDate,
    };

    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.renderDatePresets = this.renderDatePresets.bind(this);
  }

  onDatesChange({ startDate, endDate }) {
    const changeFocusedInput = this.state.focusedInput === 'startDate' ? 'endDate' : 'startDate';

    this.setState({ startDate, endDate, focusedInput: changeFocusedInput });
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  getModifiers(visibleDays) {
    const modifiers = {};
    Object.keys(visibleDays).forEach((month) => {
      modifiers[month] = {};
      visibleDays[month].forEach((day) => {
        modifiers[month][toISODateString(day)] = this.getModifiersForDay(day);
      });
    });

    return modifiers;
  }

  getModifiersForDay(day) {
    return new Set(Object.keys(this.modifiers).filter(modifier => this.modifiers[modifier](day)));
  }

  renderDatePresets() {
    const { startDate, endDate } = this.state;
    const { styles } = this.props;

    return (
      <div {...css(styles.PresetDateRangePicker_panel)}>
        {presets.map(({text, start, end}) => {
          const isSelected = isSameDay(start, startDate) && isSameDay(end, endDate);
          return (
            <button
              key={text}
              {...css(
                styles.PresetDateRangePicker_button,
                isSelected && styles.PresetDateRangePicker_button__selected,
              )}
              type="button"
              onClick={() => this.onDatesChange({startDate: start, endDate: end})}
            >
              {text}
            </button>
          );
        })}
      </div>
    );
  }

  render() {
    const { focusedInput, startDate, endDate } = this.state;

    // autoFocus, autoFocusEndDate, initialStartDate and initialEndDate are helper props for the
    // example wrapper but are not props on the SingleDatePicker itself and
    // thus, have to be omitted.
    const props = omit(this.props, [
      'autoFocus',
      'autoFocusEndDate',
      'initialStartDate',
      'initialEndDate',
    ]);

    return (
      <div>
        <DateRangePicker
          {...props}
          renderCalendarInfo={this.renderDatePresets}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    );
  }
}

DateRangePickerWrapper.propTypes = propTypes;
DateRangePickerWrapper.defaultProps = defaultProps;

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
}))(DateRangePickerWrapper);
