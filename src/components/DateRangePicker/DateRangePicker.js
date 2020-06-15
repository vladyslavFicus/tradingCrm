import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import moment from 'moment';
import { omit } from 'lodash';
import classNames from 'classnames';
import { isSameDay } from 'react-dates/lib';
import DateRangePickerController from 'react-dates/lib/components/DateRangePicker';
import { PRESETS } from './constants';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './DateRangePicker.scss';

/**
 * the initial values should come in UTC format
 */
class DateRangePicker extends PureComponent {
  static propTypes = {
    setValues: PropTypes.func.isRequired,
    values: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
    label: PropTypes.string,
    dateFormat: PropTypes.string,
    displayFormat: PropTypes.string,
    startDatePlaceholderText: PropTypes.string,
    endDatePlaceholderText: PropTypes.string,
    hideKeyboardShortcutsPanel: PropTypes.bool,
    keepOpenOnDateSelect: PropTypes.bool,
    enableOutsideDays: PropTypes.bool,
    anchorDirection: PropTypes.string,
    customArrowIcon: PropTypes.string,
    firstDayOfWeek: PropTypes.number,
    numberOfMonths: PropTypes.number,
    minimumNights: PropTypes.number,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    isDayBlocked: PropTypes.func,
    isDayHighlighted: PropTypes.func,
    isOutsideRange: PropTypes.func,
  };

  static defaultProps = {
    values: [],
    className: '',
    label: '',
    dateFormat: '',
    displayFormat: 'DD.MM.YYYY',
    startDatePlaceholderText: 'COMMON.DATE_RANGE.START_DATE',
    endDatePlaceholderText: 'COMMON.DATE_RANGE.END_DATE',
    hideKeyboardShortcutsPanel: true,
    keepOpenOnDateSelect: true,
    enableOutsideDays: true,
    anchorDirection: 'right',
    customArrowIcon: '-',
    firstDayOfWeek: 1,
    numberOfMonths: 1,
    minimumNights: 0,
    required: false,
    disabled: false,
    readOnly: true,
    isDayBlocked: () => false,
    isDayHighlighted: () => false,
    isOutsideRange: () => false,
  };

  static getDerivedStateFromProps({ values: [startDate, endDate] }) {
    return {
      startDate: startDate ? moment.utc(startDate) : null,
      endDate: endDate ? moment.utc(endDate) : null,
    };
  }

  state = {
    focusedInput: null,
    startDate: null,
    endDate: null,
  };

  onFocusChange = focusedInput => this.setState({ focusedInput });

  onDatesChange = ({ startDate, endDate }) => {
    const { setValues, dateFormat } = this.props;

    setValues([
      startDate && startDate.utc().set({ hour: '00', minute: '00', second: '00' }).format(dateFormat),
      endDate && endDate.utc().set({ hour: '23', minute: '59', second: '59' }).format(dateFormat),
    ]);
  };

  renderDatePresets = () => {
    const { values } = this.props;

    return (
      <div className="DateRangePickerWrapper__presets">
        <div className="DateRangePickerWrapper__presets-title">
          {I18n.t('DATE_PICKER.PERIOD_RESETS.TITLE')}
        </div>
        <div className="DateRangePickerWrapper__presets-list">
          {PRESETS.map(({ title, startDate, endDate }) => {
            const isSelected = isSameDay(startDate, values[0]) && isSameDay(endDate, values[1]);

            return (
              <div
                key={title}
                className={classNames('DateRangePickerWrapper__presets-item', {
                  'DateRangePickerWrapper__presets-item--is-active': isSelected,
                })}
                onClick={this.onDatesChange.bind(this, { startDate, endDate })}
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
      className,
      label,
      endDatePlaceholderText,
      startDatePlaceholderText,
      ...restProps
    } = this.props;

    const dateRangePickerProps = omit(restProps, [
      'values',
      'setValues',
      'dateFormat',
    ]);

    const { focusedInput, startDate, endDate } = this.state;

    return (
      <div
        className={classNames(
          'DateRangePickerWrapper',
          { 'DateRangePickerWrapper--focused': focusedInput },
          className,
        )}
      >
        <If condition={label}>
          <div className="DateRangePickerWrapper__label">{label}</div>
        </If>
        <DateRangePickerController
          {...dateRangePickerProps}
          startDatePlaceholderText={I18n.t(startDatePlaceholderText)}
          endDatePlaceholderText={I18n.t(endDatePlaceholderText)}
          renderCalendarInfo={this.renderDatePresets}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          startDateId="startDate"
          endDateId="endDate"
          navPrev={<i className="fa fa-angle-left" />}
          navNext={<i className="fa fa-angle-right" />}
          customInputIcon={<i className="icon icon-calendar" />}
          inputIconPosition="after"
        />
      </div>
    );
  }
}

export default DateRangePicker;
