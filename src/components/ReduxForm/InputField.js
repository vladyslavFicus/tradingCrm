import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class InputField extends Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    }).isRequired,
    label: PropTypes.string.isRequired,
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
    position: 'horizontal',
    showErrorMessage: true,
    disabled: false,
  };

  renderHorizontal = (props) => {
    const { input, label, type, disabled, meta: { touched, error }, showErrorMessage } = props;

    return (
      <div className={classNames('form-group row', { 'has-danger': touched && error })}>
        <div className="col-md-3">
          <label className="form-control-label">
            {label}
          </label>
        </div>
        <div className="col-md-9">
          <input
            {...input}
            disabled={disabled}
            type={type}
            className={classNames('form-control', { 'has-danger': touched && error })}
            placeholder={label}
          />
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
    const { input, label, type, disabled, meta: { touched, error }, showErrorMessage } = props;

    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <label className="form-control-label">{label}</label>

        <input
          {...input}
          disabled={disabled}
          type={type}
          className={classNames('form-control', { 'has-danger': touched && error })}
          placeholder={label}
        />
        {
          showErrorMessage && touched && error &&
          <div className="form-control-feedback">
            {error}
          </div>
        }
      </div>
    );
  };

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default InputField;
