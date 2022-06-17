import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { getIn } from 'formik';
import { eq, isNil } from 'lodash';
import I18n from 'i18n-js';
import { v4 } from 'uuid';
import PropTypes from 'constants/propTypes';
import Select from 'components/Select';

class FormikSelectField extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    placeholder: PropTypes.string,
    multiple: PropTypes.bool,
    multipleLabel: PropTypes.bool,
    disabled: PropTypes.bool,
    searchable: PropTypes.bool,
    withFocus: PropTypes.bool,
    withAnyOption: PropTypes.bool,
    showErrorMessage: PropTypes.bool,
    customOnChange: PropTypes.func,
    singleOptionComponent: PropTypes.func,
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
        PropTypes.array,
        PropTypes.bool,
      ]),
    }).isRequired,
    form: PropTypes.shape({
      errors: PropTypes.object.isRequired,
      touched: PropTypes.object.isRequired,
      setFieldValue: PropTypes.func.isRequired,
      setFieldTouched: PropTypes.func.isRequired,
      initialValues: PropTypes.object,
    }).isRequired,
  }

  static defaultProps = {
    className: '',
    customOnChange: null,
    disabled: false,
    label: null,
    multiple: false,
    multipleLabel: false,
    placeholder: null,
    searchable: false,
    showErrorMessage: true,
    singleOptionComponent: null,
    withAnyOption: false,
    withFocus: false,
  };

  id = `select-${v4()}`;

  onHandleChange = async (value) => {
    const {
      customOnChange,
      field: { name },
      form: { setFieldValue, setFieldTouched },
    } = this.props;

    if (customOnChange) {
      await customOnChange(value);
    } else {
      await setFieldValue(name, value);
    }
    setFieldTouched(name, true);
  }

  render() {
    const {
      children,
      className,
      disabled,
      field: {
        name,
        value,
      },
      form: {
        errors,
        touched,
        initialValues,
      },
      label,
      multiple,
      multipleLabel,
      placeholder,
      searchable,
      showErrorMessage,
      singleOptionComponent,
      withAnyOption,
      withFocus,
    } = this.props;

    const error = getIn(errors, name);
    const isTouched = getIn(touched, name);

    return (
      <div className={
        classNames(
          className,
          'form-group',
          { 'has-danger': showErrorMessage && error && isTouched },
          { 'is-disabled': disabled },
        )}
      >
        <If condition={label}>
          <label htmlFor={this.id}>{label}</label>
        </If>

        <div>
          <Select
            name={name}
            disabled={disabled}
            multiple={multiple}
            multipleLabel={multipleLabel}
            onChange={this.onHandleChange}
            placeholder={placeholder}
            isFocused={withFocus && !isNil(value) && eq(value, initialValues[name])}
            showSearch={searchable}
            singleOptionComponent={singleOptionComponent}
            value={!value && multiple ? [] : value}
          >
            {
              [
                withAnyOption && <option key="any" value={undefined}>{I18n.t('COMMON.ANY')}</option>,
                ...children,
              ]
            }
          </Select>

          {/* Hidden input for tests */}
          <input
            id={this.id}
            type="text"
            disabled={disabled}
            onChange={() => {}}
            value={value}
            style={{ display: 'none' }}
          />

          <If If condition={showErrorMessage && isTouched && error}>
            <div className="form-row">
              <div className="col form-control-feedback">
                <i className="icon icon-alert" />
                {error}
              </div>
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default FormikSelectField;
