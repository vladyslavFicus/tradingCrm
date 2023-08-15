import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import './DateCalendarPicker.scss';

class DateCalendarPicker extends PureComponent {
  static propTypes = {
    selectedDate: momentPropTypes.momentObj,
    selectedDateRange: PropTypes.shape({
      from: momentPropTypes.momentObj,
      to: momentPropTypes.momentObj,
    }),
    handleCalendarDayClick: PropTypes.func.isRequired,
    minDate: momentPropTypes.momentObj,
    maxDate: momentPropTypes.momentObj,
    weeksOnPage: PropTypes.number,
  };

  static defaultProps = {
    minDate: null,
    maxDate: null,
    selectedDate: null,
    selectedDateRange: null,
    weeksOnPage: 6,
  };

  state = {
    selectedYear: moment().year(),
    selectedMonth: moment().month(),
  };

  /**
   *
   * Get day configuration
   *
   * @param dayIndex - index of the day, where 0 is a first day of the month
   *
   * @return {Object} - dayConfiguration
   *
  */
  getDayConfig = (index) => {
    const {
      selectedDateRange, // # selected values in range date picker
      selectedDate, // # selected value in single date picker
      minDate,
      maxDate,
    } = this.props;

    const { selectedYear, selectedMonth } = this.state;

    // # For range date picker
    const { from, to } = selectedDateRange || {};

    // # Get weekday index of the first day of the month
    const firstWeekdayOfMonth = moment([selectedYear, selectedMonth, 1]).weekday();

    // # Get day index, where 0 is a first day of the month
    const dayIndex = index - firstWeekdayOfMonth;

    // # Get moment date of the current day
    const currentDay = moment([selectedYear, selectedMonth, 1]).add(dayIndex, 'days');

    // # States of the day
    const isDayOutOfMonth = currentDay.month() !== selectedMonth;
    const isToday = currentDay.isSame(moment(), 'day');
    const isRangeStart = from && currentDay.isSame(from, 'day');
    const isRangeEnd = to && currentDay.isSame(to, 'day');
    const isInRange = from && to && currentDay.isBetween(from, to, 'day');
    const isSelected = (selectedDate && currentDay.isSame(selectedDate, 'day')) || isRangeStart || isRangeEnd;
    const isDisabled = (minDate && currentDay.isBefore(minDate)) || (maxDate && currentDay.isAfter(maxDate));

    return {
      momentDate: currentDay,
      day: currentDay.date(),
      isToday,
      isDayOutOfMonth,
      isRangeStart,
      isRangeEnd,
      isSelected,
      isInRange,
      isDisabled,
    };
  }

  /**
   *
   * Get array of 'dayConfigs' for month page
   * including some days of another months to fill up empty spaces
   *
   * @return {Array} of dayDetails objects
   *
  */
  getDays = () => {
    const { weeksOnPage } = this.props;

    const maxDaysOnPage = weeksOnPage * 7;

    // # Array(maxDaysOnPage).fill() - is an array of [undefined x 'maxDaysOnPage' times]
    // # needs to using 'map' insted of using 'for' loop
    return Array(maxDaysOnPage).fill().map((_, index) => this.getDayConfig(index));
  }

  /**
   *
   * Navigation by year
   *
   * @param offset (1 | -1)
   *
  */
  changeYear = (offset) => {
    this.setState(({ selectedYear }) => ({
      selectedYear: selectedYear + offset,
    }));
  }

  /**
   *
   * Navigation by month
   *
   * @param offset (1 | -1)
   *
   * */
  changeMonth = (offset) => {
    this.setState(({ selectedYear, selectedMonth }) => {
      // # if month is January and we click back, we get December of the last year
      // # if month is December and we click forward, we get January of the next year
      const date = moment([selectedYear, selectedMonth]).month(selectedMonth + offset);

      return {
        selectedYear: date.year(),
        selectedMonth: date.month(),
      };
    });
  }

  /**
   *
   * Day clicking event
   *
   * @param dayConfig from this.getDayDetails method
   *
   * As result: returns 'momentDate' up to parent
   *
  */
  handleDayClick = ({ isDisabled, momentDate }) => {
    const { handleCalendarDayClick } = this.props;

    if (!isDisabled) {
      handleCalendarDayClick(momentDate);
    }
  }

  /**
   *
   * Rendering calendar navigation
   *
   * @return weekdays labels markup
   *
  */
  renderNav = () => {
    const { selectedYear, selectedMonth } = this.state;

    // # Returns month name like "December" using moment.locale
    const monthName = moment.months(selectedMonth);

    return (
      <div className="DateCalendarPicker__nav">
        <div
          className="DateCalendarPicker__nav-button DateCalendarPicker__nav-year"
          onClick={() => this.changeYear(-1)}
        >
          <i className="fa fa-angle-double-left" />
        </div>

        <div
          className="DateCalendarPicker__nav-button DateCalendarPicker__nav-month"
          onClick={() => this.changeMonth(-1)}
        >
          <i className="fa fa-angle-left" />
        </div>

        <div className="DateCalendarPicker__nav-title">{monthName} {selectedYear}</div>

        <div
          className="DateCalendarPicker__nav-button DateCalendarPicker__nav-month"
          onClick={() => this.changeMonth(1)}
        >
          <i className="fa fa-angle-right" />
        </div>

        <div
          className="DateCalendarPicker__nav-button DateCalendarPicker__nav-year"
          onClick={() => this.changeYear(1)}
        >
          <i className="fa fa-angle-double-right" />
        </div>
      </div>
    );
  }

  /**
   *
   * Rendering short weekdays header of calendar table
   * moment.weekdaysMin() === ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
   *
   * @return weekdays markup
   *
   * */
  renderWeekdays = () => (
    <div className="DateCalendarPicker__weekdays">
      {moment.weekdaysMin().map(weekday => (
        <div key={weekday} className="DateCalendarPicker__weekday">
          {weekday}
        </div>
      ))}
    </div>
  )

  /**
   *
   * Rendering all days of the month
   * with days of another months to fill up empty spaces
   *
   * @return days of the mouth page markup
   *
   * */
  renderDays = () => {
    const { selectedDateRange } = this.props;

    return (
      <div className="DateCalendarPicker__days">
        {this.getDays().map((dayConfig, index) => {
          const {
            day,
            isToday,
            isDayOutOfMonth,
            isSelected,
            isRangeStart,
            isRangeEnd,
            isInRange,
            isDisabled,
          } = dayConfig || {};

          return (
            <div
              key={index}
              className={
                classNames('DateCalendarPicker__day', {
                  'DateCalendarPicker__day--today': isToday,
                  'DateCalendarPicker__day--out-of-month': isDayOutOfMonth,
                  'DateCalendarPicker__day--selected': isSelected,
                  'DateCalendarPicker__day--range-start': isRangeStart && !isRangeEnd && selectedDateRange?.to,
                  'DateCalendarPicker__day--range-end': isRangeEnd && !isRangeStart && selectedDateRange?.from,
                  'DateCalendarPicker__day--range-between': isInRange,
                  'DateCalendarPicker__day--disabled': isDisabled,
                })
              }
              onClick={() => this.handleDayClick(dayConfig)}
            >
              <div className="DateCalendarPicker__day-inner">
                {day}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="DateCalendarPicker">
        {this.renderNav()}

        <div className="DateCalendarPicker__body">
          {this.renderWeekdays()}
          {this.renderDays()}
        </div>
      </div>
    );
  }
}

export default DateCalendarPicker;
