import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FormikTextAreaField.scss';

class FormikTextAreaField extends PureComponent {
  static propTypes = {
    form: PropTypes.shape({
      errors: PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
        ]),
      ).isRequired,
      touched: PropTypes.objectOf(PropTypes.bool),
      setFieldValue: PropTypes.func.isRequired,
    }).isRequired,
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
      ]),
    }).isRequired,
    labelClassName: PropTypes.string,
    showErrorMessage: PropTypes.bool,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    className: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    disabled: PropTypes.bool,
    helpText: PropTypes.node,
    resize: PropTypes.string,
    id: PropTypes.string,
  };

  static defaultProps = {
    showErrorMessage: true,
    labelClassName: null,
    placeholder: null,
    className: null,
    disabled: false,
    maxLength: null,
    helpText: null,
    resize: 'none',
    label: null,
    id: null,
  };

  render() {
    const {
      field: {
        name,
        value,
      },
      form: {
        setFieldValue,
        touched,
        errors,
      },
      showErrorMessage,
      labelClassName,
      placeholder,
      className,
      maxLength,
      helpText,
      disabled,
      resize,
      label,
      id,
    } = this.props;

    return (
      <div className={
        classNames(
          'FormikTextAreaField',
          className,
          {
            'FormikTextAreaField--error': touched && errors[name],
          },
        )
      }
      >
        <If condition={label}>
          <label className={
            classNames(
              'FormikTextAreaField__label',
              labelClassName,
            )
          }
          >
            {label}
          </label>
        </If>
        <textarea
          className={classNames(
            'FormikTextAreaField__textarea',
            {
              'FormikTextAreaField__textarea--disabled': disabled,
              'FormikTextAreaField__textarea-resize--none': resize === 'none',
              'FormikTextAreaField__textarea-resize--both': resize === 'both',
              'FormikTextAreaField__textarea-resize--horizontal': resize === 'horizontal',
              'FormikTextAreaField__textarea-resize--vertical': resize === 'vertical',
              'FormikTextAreaField__textarea--error': showErrorMessage && errors[name],
            },
          )}
          onChange={e => setFieldValue(name, e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          value={value}
          name={name}
          id={id}
        />
        <If condition={helpText || (showErrorMessage && touched && errors[name])}>
          <div>
            <If condition={showErrorMessage && touched && errors[name]}>
              <div className="FormikTextAreaField__error-wrapper">
                <i className="FormikTextAreaField__error-icon icon-alert" />
                {errors[name]}
              </div>
            </If>
            <If condition={helpText}>
              <div className="FormikTextAreaField__help">
                {helpText}
              </div>
            </If>
          </div>
        </If>
      </div>
    );
  }
}

export default FormikTextAreaField;
