import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactPhoneInput from 'react-phone-input';
import './PhoneField.scss';

class PhoneField extends Component {
  static propTypes = {
    className: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    }).isRequired,
    label: PropTypes.string,
    labelAddon: PropTypes.any,
    labelClassName: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    showErrorMessage: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
    phoneInput: PropTypes.shape({
      defaultCountry: PropTypes.string,
      excludeCountries: PropTypes.arrayOf(PropTypes.string),
      onlyCountries: PropTypes.arrayOf(PropTypes.string),
      preferredCountries: PropTypes.arrayOf(PropTypes.string),
    }),
  };
  static defaultProps = {
    className: 'form-group',
    label: null,
    labelAddon: null,
    labelClassName: 'form-control-label',
    position: 'horizontal',
    showErrorMessage: true,
    disabled: false,
    placeholder: null,
    phoneInput: {
      defaultCountry: 'ua',
      excludeCountries: [],
      onlyCountries: [],
      preferredCountries: [],
    },
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
      <div className={classNames('redux-form__phone-field', `${className} row`, { 'has-danger': touched && error })}>
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
      <div className={classNames('phone-field', className, { 'has-danger': touched && error })}>
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
    const { input, phoneInput } = props;

    return <ReactPhoneInput {...input} {...phoneInput} />;
  };

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default PhoneField;
