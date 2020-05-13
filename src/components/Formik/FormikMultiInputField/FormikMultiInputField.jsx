import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FieldLabel from './FieldLabel';
import MultiInput from '../../MultiInput';

class FormikMultiInputField extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    field: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
      onChange: PropTypes.func,
    }).isRequired,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    labelAddon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    customOnChange: PropTypes.func,
    showErrorMessage: PropTypes.bool,
    disabled: PropTypes.bool,
    form: PropTypes.shape({
      touched: PropTypes.object.isRequired,
      errors: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
      setFieldValue: PropTypes.func.isRequired,
    }).isRequired,
    labelClassName: PropTypes.string,
    helpText: PropTypes.node,
    placeholder: PropTypes.string,
    maxLength: PropTypes.string,
    async: PropTypes.bool,
    loadOptions: PropTypes.func,
  };

  static defaultProps = {
    className: null,
    label: null,
    customOnChange: null,
    labelAddon: null,
    showErrorMessage: true,
    disabled: false,
    labelClassName: null,
    helpText: null,
    placeholder: null,
    maxLength: null,
    async: false,
    loadOptions: null,
  };

  onHandleChange = (value) => {
    const {
      customOnChange,
      field: { name },
      form: { setFieldValue },
    } = this.props;

    if (customOnChange) {
      customOnChange(value);
    } else {
      setFieldValue(name, value);
    }
  }

  renderInput = () => {
    const {
      disabled,
      placeholder,
      maxLength,
      label,
      async,
      field: { value },
      loadOptions,
    } = this.props;

    return (
      <MultiInput
        async={async}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder !== null ? placeholder : label}
        onChange={this.onHandleChange}
        initialValues={value ? value.map(v => ({ label: v, value: v })) : []}
        loadOptions={loadOptions}
      />
    );
  };

  render() {
    const {
      label,
      labelClassName,
      labelAddon,
      className,
      field: {
        name,
      },
      form: {
        touched,
        errors,
      },
      showErrorMessage,
      helpText,
      disabled,
    } = this.props;

    const groupClassName = classNames(
      'form-group',
      className,
      { 'has-danger': touched && errors },
      { 'is-disabled': disabled },
    );

    return (
      <div className={groupClassName}>
        <FieldLabel
          label={label}
          addon={labelAddon}
          className={labelClassName}
        />
        {this.renderInput()}
        <If condition={helpText || (showErrorMessage && touched[name] && errors[name])}>
          <div className="form-row">
            <If condition={showErrorMessage && touched[name] && errors[name]}>
              <div className="col form-control-feedback">
                <i className="icon icon-alert" />
                {errors[name]}
              </div>
            </If>
            <If condition={helpText}>
              <div className="col form-group-help">
                {helpText}
              </div>
            </If>
          </div>
        </If>
      </div>
    );
  }
}

export default FormikMultiInputField;
