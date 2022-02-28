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
    customTouched: PropTypes.bool,
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
      initialValues: PropTypes.object,
    }).isRequired,
  }

  static defaultProps = {
    className: '',
    customOnChange: null,
    customTouched: true,
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
        initialValues,
      },
      label,
      multiple,
      multipleLabel,
      placeholder,
      searchable,
      showErrorMessage,
      customTouched,
      singleOptionComponent,
      withAnyOption,
      withFocus,
    } = this.props;

    const error = getIn(errors, name);

    return (
      <div className={classNames(
        className,
        'form-group',
        { 'has-danger': showErrorMessage && error },
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
            defaultValue={value}
            style={{ display: 'none' }}
          />

          <If condition={showErrorMessage && customTouched && error}>
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
