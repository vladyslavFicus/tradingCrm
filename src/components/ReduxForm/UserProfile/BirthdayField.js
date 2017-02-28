import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DatePicker from 'components/Forms/DatePicker';

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
    const { input, label, disabled, wrapperClassName } = this.props;

    return (
      <div className={wrapperClassName}>
        <label>{label}</label>
        <div className="input-group">
          <span className="input-group-addon">
            <i className="fa fa-calendar"/>
          </span>
          <DatePicker
            dateFormat="MM/DD/YYYY"
            timeFormat={false}
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
