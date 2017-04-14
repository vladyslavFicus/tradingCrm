import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Currency from '../../components/Amount/Currency';

class AmountCurrencyField extends Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    }).isRequired,
    label: PropTypes.string.isRequired,
    labelClassName: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    showErrorMessage: PropTypes.bool,
    inputClassName: PropTypes.string,
    disabled: PropTypes.bool,
    currencyCode: PropTypes.string,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    labelClassName: 'form-control-label',
    position: 'horizontal',
    showErrorMessage: true,
    disabled: false,
    placeholder: null,
  };

  render() {
    const {
      input,
      label,
      labelClassName,
      currencyCode,
      placeholder,
      type,
      disabled,
      inputClassName,
      meta: { touched, error },
      showErrorMessage,
    } = this.props;

    return (
      <div>
        <label className={labelClassName}>{label}</label>
        <div className={classNames('input-group', { 'has-danger': touched && error })}>
          <div className="input-group-addon">
            {currencyCode && <Currency code={currencyCode} />}
          </div>
          <input
            {...input}
            disabled={disabled}
            type={type}
            className={classNames('form-control', inputClassName, { 'has-danger': touched && error })}
            placeholder={placeholder}
            title={placeholder}
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
  }
}

export default AmountCurrencyField;
