import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash/omit';
import { Field } from 'redux-form';
import { DateRangePickerPhrases } from 'react-dates/lib/defaultPhrases';
import { DateRangePickerShape, isInclusivelyAfterDay, isSameDay } from 'react-dates/lib';
import { START_DATE, END_DATE, HORIZONTAL_ORIENTATION, ANCHOR_LEFT } from 'react-dates/constants';
import DateRangePickerController from 'react-dates/lib/components/DateRangePicker';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './DateRangePicker.scss';

import { presets } from './periodPresets';

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

  onFocusChange = focusedInput => this.setState({ focusedInput });

  handlePresetClick = (startDate, endDate) => () => this.onDatesChange({ startDate, endDate });

  renderDatePresets = () => {
    const { startDate, endDate } = this.state;

    return (
      <ul className="presetsBlock">
        <li>{I18n.t('DATE_PICKER.PERIOD_RESETS.TITLE')}</li>
        {presets.map(({ text, start, end }) => {
          const isSelected = isSameDay(start, startDate) && isSameDay(end, endDate);
          return (
            <li
              key={text}
              className={classNames({ active: isSelected })}
              onClick={this.handlePresetClick(start, end)}
            >
              {I18n.t(text)}
            </li>
          );
        })}
      </ul>
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
      <div className="nasDateRangePicker">
        <DateRangePickerController
          {...props}
          renderCalendarInfo={this.renderDatePresets}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          navPrev={<i className="fa fa-angle-left" />}
          navNext={<i className="fa fa-angle-right" />}
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

DateRangePicker.propTypes = {
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
DateRangePicker.defaultProps = {
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
  displayFormat: 'DD.MM.YYYY',
  monthFormat: 'MMMM YYYY',
  phrases: DateRangePickerPhrases,
  withTime: true,
  dateFormat: 'YYYY-MM-DD',
};

export default DateRangePicker;
