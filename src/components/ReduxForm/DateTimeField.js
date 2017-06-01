import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTime from 'react-datetime';

class DateTimeField extends Component {
  static propTypes = {
    className: PropTypes.string,
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      name: PropTypes.string,
      value: PropTypes.any,
    }).isRequired,
    isValidDate: PropTypes.func.isRequired,
    label: PropTypes.string,
    labelClassName: PropTypes.string,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    dateFormat: PropTypes.string,
    timeFormat: PropTypes.string,
    inputAddon: PropTypes.bool,
    position: PropTypes.oneOf(['horizontal', 'vertical']),
  };
  static defaultProps = {
    label: null,
    labelClassName: 'form-control-label',
    className: 'form-group',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm',
    position: 'horizontal',
    inputAddon: true,
  };

  handleChange = (value) => {
    this.props.input.onChange(value ? value.format(`YYYY-MM-DD${this.props.timeFormat ? 'THH:mm:00' : ''}`) : '');
  };

  renderInput = () => {
    const {
      inputAddon,
      input,
      disabled,
      placeholder,
      isValidDate,
      dateFormat,
      timeFormat,
    } = this.props;

    const inputField = (
      <DateTime
        dateFormat={dateFormat}
        timeFormat={timeFormat}
        onChange={this.handleChange}
        value={input.value ? moment(input.value) : null}
        closeOnSelect
        inputProps={{
          disabled,
          placeholder,
        }}
        isValidDate={isValidDate}
      />
    );

    if (inputAddon) {
      return (
        <div className="input-group">
          {inputField}
          <span className="input-group-addon">
            <i className="fa fa-calendar" />
          </span>
        </div>
      );
    }

    return <div className="input-group">{inputField}</div>;
  }

  renderLabel = (props) => {
    const {
      label,
      labelClassName,
      position,
    } = props;

    if (!label) {
      return null;
    }

    const labelNode = <label className={labelClassName}>{label}</label>;

    return position === 'vertical'
      ? labelNode
      : <div className="col-md-3">{labelNode}</div>;
  };

  renderVertical = (props) => {
    const {
      className,
      meta: { touched, error },
    } = props;

    return (
      <div className={classNames(className, { 'has-danger': touched && error })}>
        {this.renderLabel(props)}
        {this.renderInput(props)}
      </div>
    );
  };

  renderHorizontal = (props) => {
    const {
      className,
      meta: { touched, error },
    } = props;

    return (
      <div className={classNames(`${className} row`, { 'has-danger': touched && error })}>
        {this.renderLabel(props)}
        <div className="col-md-9">
          {this.renderInput(props)}
        </div>
      </div>
    );
  };

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default DateTimeField;
