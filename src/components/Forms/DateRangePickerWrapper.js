import React from 'react';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';

class DateRangePickerWrapper extends React.Component {
  constructor(props) {
    super(props);

    /**
     * Dirty hack =)
     */
    moment.updateLocale('en', {
      longDateFormat: {
        L: 'DD.MM.YYYY',
      },
    });

    this.state = {
      focusedInput: null,
      startDate: null,
      endDate: null,
    };

    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate }, () => {
      this.props.onDatesChange({ startDate, endDate });
    });
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    const { focusedInput, startDate, endDate } = this.state;
    return (
      <div>
        <DateRangePicker
          {...this.props}
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

DateRangePickerWrapper.propTypes = {
  onDatesChange: React.PropTypes.func,
};

export default DateRangePickerWrapper;
