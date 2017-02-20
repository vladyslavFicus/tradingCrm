import React, { Component, PropTypes } from 'react';
import SingleDatePicker from 'components/Forms/RemoteSingleDatePicker';
import classNames from 'classnames';
import moment from 'moment';

class SingleDateField extends Component {
  handleDateChange = (date) => {
    const { input: { onChange } } = this.props;

    onChange(date ? date.format('YYYY-MM-DD') + 'T00:00:00' : '');
  };

  render() {
    const { input, label, disabled, wrapperClassName, meta: { touched, error } } = this.props;

    return (
      <div className={wrapperClassName}>
        <label>{label}</label>
        <div className="input-group">
          <span className="input-group-addon">
            <i className="fa fa-calendar"></i>
          </span>

          <SingleDatePicker
            id={`single-date-picker-${input.name}`}
            isOutsideRange={(day) => day < moment()}
            onDateChange={this.handleDateChange}
            date={input.value ? moment(input.value) : null}
            disabled={disabled}
          />

          <input
            {...input}
            disabled={disabled}
            type="hidden"
            className={classNames('form-control', { 'has-danger': touched && error })}
            placeholder={label}
          />
        </div>
      </div>
    );
  };
}

SingleDateField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
};

export default SingleDateField;
