import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { getIn } from 'formik';
import { eq, isNil } from 'lodash';
import I18n from 'i18n-js';
import { v4 } from 'uuid';
import PropTypes from 'constants/propTypes';
import Select from 'components/Select';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import './FormikSelectField.scss';

class FormikSelectField extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    labelTooltip: PropTypes.string,
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
    withGroup: PropTypes.shape({
      firstTitle: PropTypes.string,
      secondTitle: PropTypes.string,
    }),
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
  };

  static defaultProps = {
    className: '',
    customOnChange: null,
    disabled: false,
    label: null,
    labelTooltip: null,
    multiple: false,
    multipleLabel: false,
    placeholder: null,
    searchable: false,
    showErrorMessage: true,
    singleOptionComponent: null,
    withAnyOption: false,
    withFocus: false,
    withGroup: null,
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
  };

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
      labelTooltip,
      multiple,
      multipleLabel,
      placeholder,
      searchable,
      showErrorMessage,
      singleOptionComponent,
      withAnyOption,
      withFocus,
      withGroup,
    } = this.props;

    const error = getIn(errors, name);
    const isTouched = getIn(touched, name);
    const tooltipId = `label-${name}`;

    return (
      <div className={
        classNames(
          'FormikSelectField',
          className,
          { 'has-danger': showErrorMessage && error && isTouched },
          { 'is-disabled': disabled },
        )}
      >
        <If condition={label}>
          <label className="FormikSelectField__label" htmlFor={this.id}>{label}</label>

          <If condition={!!labelTooltip}>
            <span id={tooltipId}>
              <i className="FormikSelectField__icon fa fa-info-circle" />
            </span>

            <UncontrolledTooltip
              fade={false}
              target={tooltipId}
            >
              {labelTooltip}
            </UncontrolledTooltip>
          </If>
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
            withGroup={withGroup}
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

          <If condition={showErrorMessage && isTouched && error}>
            <div className="FormikSelectField__error">
              <i className="icon icon-alert" />
              {error}
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default FormikSelectField;
