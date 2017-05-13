import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import SingleDatePicker from '../Forms/RemoteSingleDatePicker';

class SingleDateField extends Component {
  static propTypes = {
    className: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    }).isRequired,
    label: PropTypes.string,
    labelAddon: PropTypes.any,
    labelClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    inputAddon: PropTypes.element,
    inputButton: PropTypes.any,
    showInputButton: PropTypes.bool,
    type: PropTypes.string.isRequired,
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    showErrorMessage: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
  };
  static defaultProps = {
    className: 'form-group',
    label: null,
    labelAddon: null,
    labelClassName: 'form-control-label',
    inputClassName: 'form-control',
    showInputButton: false,
    position: 'horizontal',
    showErrorMessage: true,
    disabled: false,
    inputAddon: null,
  };

  handleDateChange = (date) => {
    const { input: { onChange } } = this.props;

    onChange(date ? `${date.format('YYYY-MM-DD')}T00:00:00` : '');
  };

  renderLabel = (props) => {
    const {
      label,
      labelClassName,
      labelAddon,
      position,
    } = props;

    if (!label) {
      return null;
    }

    const labelNode = (
      !labelAddon
        ? <label className={labelClassName}>{label}</label>
        : <div className={labelClassName}>{label} {labelAddon}</div>
    );

    return position === 'vertical'
      ? labelNode
      : <div className="col-md-3">{labelNode}</div>;
  };
  renderHorizontal = (props) => {
    const {
      className,
      meta: { touched, error },
      showErrorMessage,
    } = props;

    return (
      <div className={classNames(`${className} row`, { 'has-danger': touched && error })}>
        {this.renderLabel(props)}
        <div className="col-md-9">
          {this.renderInput(props)}
          {
            showErrorMessage && touched && error &&
            <div className="form-control-feedback">
              {error}
            </div>
          }
        </div>
      </div>
    );
  };

  renderVertical = (props) => {
    const {
      className,
      meta: { touched, error },
      showErrorMessage,
    } = props;

    return (
      <div className={classNames(className, { 'has-danger': touched && error })}>
        {this.renderLabel(props)}
        {this.renderInput(props)}
        {
          showErrorMessage && touched && error &&
          <div className="form-control-feedback">
            {error}
          </div>
        }
      </div>
    );
  };

  renderInput = (props) => {
    const {
      inputAddon,
      inputButton,
      showInputButton,
      input,
      disabled,
      inputClassName,
      meta: { touched, error },
      label,
    } = props;

    let inputField = (
      <div>
        <SingleDatePicker
          id={`single-date-picker-${input.name}`}
          isOutsideRange={day => day < moment()}
          onDateChange={this.handleDateChange}
          date={input.value ? moment(input.value) : null}
          disabled={disabled}
          className={inputClassName}
        />

        <input
          {...input}
          disabled={disabled}
          type="hidden"
          className={classNames('form-control', { 'has-danger': touched && error })}
          placeholder={label}
        />
      </div>
    );

    if (inputAddon) {
      inputField = (
        <div className="input-group">
          <div className="input-group-addon">
            {inputAddon}
          </div>
          {inputField}
        </div>
      );
    }

    if (inputButton) {
      inputField = (
        <div className="form-control-with-button">
          {inputField}
          <div className="form-control-button">
            {showInputButton && inputButton}
          </div>
        </div>
      );
    }

    return inputField;
  };

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default SingleDateField;
