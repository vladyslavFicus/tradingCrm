import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import momentPropTypes from 'react-moment-proptypes';
import { omit } from 'lodash';
import { DateRangePickerShape, isSameDay } from 'react-dates/lib';
import DateRangePickerController from 'react-dates/lib/components/DateRangePicker';
import { START_DATE, END_DATE } from 'react-dates/constants';
import { PRESETS } from './constants';
import 'react-dates/lib/css/_datepicker.css';
import './FormikDateRangePicker.scss';

class FormikDateRangePicker extends PureComponent {
  static propTypes = {
    ...omit(DateRangePickerShape, [
      'startDate',
      'endDate',
      'change',
      'focusedInput',
      'onFocusChange',
      'onDatesChange',
      'anchorDirection',
    ]),
    anchorDirection: PropTypes.string,
    className: PropTypes.string,
    customArrowIcon: PropTypes.string,
    dateFormat: PropTypes.string,
    disabled: PropTypes.bool,
    displayFormat: PropTypes.string,
    enableOutsideDays: PropTypes.bool,
    endDateId: PropTypes.string,
    endDatePlaceholderText: PropTypes.string,
    firstDayOfWeek: PropTypes.number,
    form: PropTypes.shape({
      values: PropTypes.objectOf(PropTypes.string),
      setFieldValue: PropTypes.func,
    }).isRequired,
    hideKeyboardShortcutsPanel: PropTypes.bool,
    initialStartDate: momentPropTypes.momentObj,
    initialEndDate: momentPropTypes.momentObj,
    isDayBlocked: PropTypes.func,
    isDayHighlighted: PropTypes.func,
    isOutsideRange: PropTypes.func,
    keepOpenOnDateSelect: PropTypes.bool,
    label: PropTypes.string,
    minimumNights: PropTypes.number,
    monthFormat: PropTypes.string,
    navNext: PropTypes.string,
    navPrev: PropTypes.string,
    numberOfMonths: PropTypes.number,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onNextMonthClick: PropTypes.func,
    onPrevMonthClick: PropTypes.func,
    periodKeys: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
    }).isRequired,
    required: PropTypes.bool,
    startDateId: PropTypes.string,
    startDatePlaceholderText: PropTypes.string,
    withTime: PropTypes.bool,
  };

  static defaultProps = {
    anchorDirection: 'right',
    className: '',
    customArrowIcon: '-',
    dateFormat: 'YYYY-MM-DD',
    disabled: false,
    displayFormat: 'DD.MM.YYYY',
    enableOutsideDays: true,
    endDateId: END_DATE,
    endDatePlaceholderText: 'COMMON.DATE_RANGE.END_DATE',
    firstDayOfWeek: 1,
    hideKeyboardShortcutsPanel: true,
    initialStartDate: null,
    initialEndDate: null,
    isDayBlocked: () => false,
    isDayHighlighted: () => false,
    isOutsideRange: () => false,
    keepOpenOnDateSelect: true,
    label: '',
    minimumNights: 1,
    monthFormat: 'MMMM YYYY',
    navNext: null,
    navPrev: null,
    numberOfMonths: 1,
    onChange: () => {},
    onClose: () => {},
    onNextMonthClick: () => {},
    onPrevMonthClick: () => {},
    required: false,
    startDateId: START_DATE,
    startDatePlaceholderText: 'COMMON.DATE_RANGE.START_DATE',
    withTime: false,
  };

  state = {
    startDate: '',
    endDate: '',
    focusedInput: null,
  };

  componentDidUpdate() {
    const {
      form: { values },
      periodKeys: { start, end },
    } = this.props;

    const { startDate, endDate } = this.state;

    if ((!values[start] && startDate) && (!values[end] && endDate)) {
      this.resetDatePickerState();
    }
  }

  resetDatePickerState = () => {
    this.setState({ startDate: '', endDate: '' });
  };

  onDatesChange = ({ startDate, endDate }) => {
    const {
      onChange,
      withTime,
      dateFormat,
      form: { setFieldValue },
      periodKeys: {
        start: startKey,
        end: endKey,
      },
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

      setFieldValue(startKey, start);
      setFieldValue(endKey, end);

      onChange(startKey, start);
      onChange(endKey, end);
    });
  };

  onFocusChange = focusedInput => this.setState({ focusedInput });

  handlePresetClick = (startDate, endDate) => () => this.onDatesChange({ startDate, endDate });

  renderDatePresets = () => {
    const {
      form: { values },
      periodKeys: {
        start: startKey,
        end: endKey,
      },
    } = this.props;

    return (
      <div className="FormikDateRangePicker__presets">
        <div className="FormikDateRangePicker__presets-title">
          {I18n.t('DATE_PICKER.PERIOD_RESETS.TITLE')}
        </div>
        <div className="FormikDateRangePicker__presets-list">
          {PRESETS.map(({ title, start, end }) => {
            const isSelected = isSameDay(start, values[startKey]) && isSameDay(end, values[endKey]);

            return (
              <div
                key={title}
                className={
                  classNames(
                    'FormikDateRangePicker__presets-item', {
                      'FormikDateRangePicker__presets-item--is-active': isSelected,
                    },
                  )
                }
                onClick={this.handlePresetClick(start, end)}
              >
                {I18n.t(title)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  render() {
    const {
      label,
      className,
      initialEndDate,
      initialStartDate,
      endDatePlaceholderText,
      startDatePlaceholderText,
      ...rest
    } = this.props;

    const datePickerProps = {
      ...omit(rest, [
        'field', 'form', 'periodKeys', 'children', 'dateFormat', 'onChange', 'withTime',
      ]),
    };

    const { startDate, endDate, focusedInput } = this.state;

    return (
      <div
        className={
          classNames(
            'FormikDateRangePicker',
            { 'FormikDateRangePicker--focused': focusedInput !== null },
            className,
          )
        }
      >
        <If condition={label}>
          <div className="FormikDateRangePicker__label">{label}</div>
        </If>
        <DateRangePickerController
          {...datePickerProps}
          startDatePlaceholderText={I18n.t(startDatePlaceholderText)}
          endDatePlaceholderText={I18n.t(endDatePlaceholderText)}
          renderCalendarInfo={this.renderDatePresets}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate || initialStartDate || null}
          endDate={endDate || initialEndDate || null}
          navPrev={<i className="fa fa-angle-left" />}
          navNext={<i className="fa fa-angle-right" />}
          customInputIcon={<i className="icon icon-calendar" />}
          inputIconPosition="after"
        />
      </div>
    );
  }
}

export default FormikDateRangePicker;
