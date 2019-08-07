import React, { PureComponent } from 'react';
import BigCalendar, { Views } from '@hrzn/react-big-calendar';
import PropTypes from 'prop-types';
import moment from 'moment';
import '@hrzn/react-big-calendar/lib/css/react-big-calendar.css';
import Toolbar from './components/Toolbar';

const localizer = BigCalendar.momentLocalizer(moment);

class Calendar extends PureComponent {
  static propTypes = {
    ...BigCalendar.propTypes, // eslint-disable-line
    onRangeChange: PropTypes.func,
  };

  static defaultProps = {
    onRangeChange: () => {},
  };

  /**
   * Get first visible date in calendar
   * @param date
   * @return {moment.Moment}
   */
  static firstVisibleDate(date) {
    return moment(date).startOf('month').startOf('week');
  }

  /**
   * Get las visible date in calendar
   * @param date
   * @return {moment.Moment}
   */
  static lastVisibleDate(date) {
    return moment(date).endOf('month').endOf('week');
  }

  /**
   * Handle on range change event
   * @param range
   */
  onRangeChange = (range) => {
    let rangeObject = {};

    // Convert range to object { start: Moment, end: Moment }
    if (Array.isArray(range)) {
      rangeObject = {
        start: moment(range[0]).startOf('day'),
        end: moment(range[range.length - 1]).endOf('day'),
      };
    } else if (typeof range === 'object' && range.start && range.end) {
      rangeObject = {
        start: moment(range.start).startOf('day'),
        end: moment(range.end).endOf('day'),
      };
    }

    this.props.onRangeChange(rangeObject);
  };

  render() {
    return (
      <BigCalendar
        popup
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        localizer={localizer}
        components={{ toolbar: Toolbar }}
        {...this.props}
        onRangeChange={this.onRangeChange}
      />
    );
  }
}

export default Calendar;
