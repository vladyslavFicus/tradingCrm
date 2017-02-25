import React, { Component, PropTypes } from 'react';
import ReactDateTime from 'react-datetime';

class DatePicker extends Component {
  onDateChange = (date) => {
    this.setState({ date }, () => this.props.onChange(date));
  };

  render() {
    return (
      <ReactDateTime
        {...this.props}
        onChange={this.onDateChange}
      />
    );
  }
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  dateFormat: PropTypes.string,
  timeFormat: PropTypes.bool,
  closeOnSelect: PropTypes.bool,
  inputProps: PropTypes.object,
};

DatePicker.defaultProps = {
  dateFormat: 'MM/DD/YYYY',
  timeFormat: false,
  inputProps: {
    disabled: false,
  },
  closeOnSelect: true,
};

export default DatePicker;
