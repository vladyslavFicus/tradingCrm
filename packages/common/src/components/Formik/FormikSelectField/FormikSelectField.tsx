import React from 'react';
import classNames from 'classnames';
import { FieldProps, getIn } from 'formik';
import { eq, isNil } from 'lodash';
import I18n from 'i18n-js';
import { v4 } from 'uuid';
import { UncontrolledTooltip } from 'components';
import { Select } from '../../Select';
import { DefaultFieldProps } from '../types';
import './FormikSelectField.scss';

type WithGroup = {
  firstTitle?: string,
  secondTitle?: string,
};

type Props = DefaultFieldProps & {
  children: Array<React.ReactNode>,
  withGroup: WithGroup,
  labelTooltip?: string,
  multiple?: boolean,
  multipleLabel?: boolean,
  searchable?: boolean,
  withAnyOption?: boolean,
  showErrorMessage?: boolean,
  customOnChange?: (value: string) => void,
  singleOptionComponent?: () => void,
};

const FormikSelectField = (props: Props & FieldProps) => {
  const {
    children,
    field: {
      name,
      value,
    },
    form: {
      errors,
      touched,
      initialValues,
      setFieldValue,
      setFieldTouched,
    },
    className = '',
    customOnChange = null,
    disabled = false,
    label = null,
    labelTooltip = null,
    multiple = false,
    multipleLabel = false,
    placeholder = null,
    searchable = false,
    showErrorMessage = true,
    singleOptionComponent = null,
    withAnyOption = false,
    withFocus = false,
    withGroup = null,
  } = props;

  const id = `select-${v4()}`;
  const error = getIn(errors, name);
  const isTouched = getIn(touched, name);
  const tooltipId = `label-${name}`;

  const onHandleChange = async (chooseValue: string) => {
    if (customOnChange) {
      await customOnChange(chooseValue);
    } else {
      await setFieldValue(name, chooseValue);
    }

    setFieldTouched(name, true);
  };

  return (
    <div className={
        classNames(
          'FormikSelectField',
          className,
          { 'has-danger': showErrorMessage && error && isTouched },
          { 'is-disabled': disabled },
        )}
    >
      <If condition={!!label}>
        <label className="FormikSelectField__label" htmlFor={id}>{label}</label>

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
          onChange={onHandleChange}
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
          id={id}
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
};

export default React.memo(FormikSelectField);
