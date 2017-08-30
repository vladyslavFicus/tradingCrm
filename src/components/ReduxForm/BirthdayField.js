import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from '../Forms/DatePicker';

const AGE_YEARS_CONSTRAINT = 18;

class BirthdayField extends Component {
  handleDateChange = (date) => {
    const { input: { onChange } } = this.props;

    onChange(date ? date.format('YYYY-MM-DD') + 'T00:00:00' : '');
  };

  ageValidator = (current) => {
    const requireAge = moment().subtract(AGE_YEARS_CONSTRAINT, 'year');

    return current.isBefore(requireAge);
  };

  render() {
    const { input, label, disabled } = this.props;

    return (
      <div className="form-group">
        <label>{label}</label>
        <div className="input-with-icon input-with-icon__left">
          <i className="input-left-icon nas nas-calendar_icon" />

          <DatePicker
            dateFormat="MM/DD/YYYY"
            timeFormat={null}
            onChange={this.handleDateChange}
            value={input.value ? moment(input.value) : null}
            closeOnSelect={true}
            inputProps={{
              disabled
            }}
            isValidDate={this.ageValidator}
          />
        </div>
      </div>
    );
  };
}

export default BirthdayField;
