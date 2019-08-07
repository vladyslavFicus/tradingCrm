import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-dates';

class RemoteDateRangePickerWrapper extends Component {
  state = {
    focusedInput: null,
  };

  onFocusChange = (focusedInput) => {
    this.setState({ focusedInput });
  };

  render() {
    const { startDate, endDate } = this.props;
    const { focusedInput } = this.state;

    return (
      <div>
        <DateRangePicker
          {...this.props}
          onDatesChange={this.props.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    );
  }
}

RemoteDateRangePickerWrapper.propTypes = {
  onDatesChange: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
};

RemoteDateRangePickerWrapper.defaultProps = {
  onDatesChange: () => {},
  startDate: null,
  endDate: null,
};

export default RemoteDateRangePickerWrapper;
