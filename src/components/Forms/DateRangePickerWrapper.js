import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-dates';

class DateRangePickerWrapper extends Component {
  state = {
    focusedInput: null,
    startDate: null,
    endDate: null,
  };

  onDatesChange = ({ startDate, endDate }) => {
    this.setState({ startDate, endDate }, () => {
      this.props.onDatesChange({ startDate, endDate });
    });
  };

  onFocusChange = (focusedInput) => {
    this.setState({ focusedInput });
  };

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
  onDatesChange: PropTypes.func,
};

DateRangePickerWrapper.defaultProps = {
  onDatesChange: () => {},
};

export default DateRangePickerWrapper;
