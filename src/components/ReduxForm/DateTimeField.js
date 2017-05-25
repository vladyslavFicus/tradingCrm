import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTime from 'react-datetime';

class DateTimeField extends Component {
  static propTypes = {
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      name: PropTypes.string,
      value: PropTypes.any,
    }).isRequired,
    isValidDate: PropTypes.func.isRequired,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    dateFormat: PropTypes.string,
    timeFormat: PropTypes.string,
  };
  static defaultProps = {
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm',
  };

  handleChange = (value) => {
    this.props.input.onChange(value ? value.format(`YYYY-MM-DD${this.props.timeFormat ? 'THH:mm:00' : ''}`) : '');
  };

  render() {
    const {
      input,
      placeholder,
      disabled,
      meta: { touched, error },
      isValidDate,
    } = this.props;

    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <div className="input-group">
          <DateTime
            dateFormat="MM/DD/YYYY"
            timeFormat="HH:mm"
            onChange={this.handleChange}
            value={input.value ? moment(input.value) : null}
            closeOnSelect
            inputProps={{
              disabled,
              placeholder,
            }}
            isValidDate={isValidDate}
          />
          <span className="input-group-addon">
            <i className="fa fa-calendar" />
          </span>
        </div>
      </div>
    );
  }
}

export default DateTimeField;
