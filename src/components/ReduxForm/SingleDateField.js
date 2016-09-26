import React, { Component, PropTypes } from 'react';
import SingleDatePicker from 'components/Forms/RemoteSingleDatePicker';
import classNames from 'classnames';
import moment from 'moment';

class SingleDateField extends Component {
  constructor(props) {
    super(props);

    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(date) {
    const { input: { name }, meta:{ dispatch }, onChange } = this.props;

    dispatch(onChange(name, date ? date.format('YYYY-MM-DD') + 'T00:00:00' : ''));
  }

  render() {
    const { input, label, disabled, meta: { touched, error } } = this.props;

    return <div className={classNames('form-group row', { 'has-danger': touched && error })}>
      <div className="col-md-3">
        <label className="form-control-label">
          {label}
        </label>
      </div>
      <div className="col-md-9">
        <SingleDatePicker
          id={`single-date-picker-${input.name}`}
          isOutsideRange={(day) => day <= moment()}
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
        {touched && error && <div className="form-control-feedback">
          {error}
        </div>}
      </div>
    </div>;
  }
}

SingleDateField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
};

export default SingleDateField;
