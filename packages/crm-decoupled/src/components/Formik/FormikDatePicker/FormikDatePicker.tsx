// @ts-nocheck
import React from 'react';
import { omit } from 'lodash';
import { FieldProps } from 'formik';
import moment from 'moment';
import { DatePicker } from 'components/DatePickers';
import { DefaultFieldProps } from '../types';

type Props = DefaultFieldProps & {
  withTime?: string,
  withUtc?: string,
  showErrorMessage?: boolean,
  minDate?: moment.Moment,
  maxDate?: moment.Moment,
  maxTime?: string,
  minTime?: string,
  closeOnSelect?: boolean,
  withConfirmation?: boolean,
};

const FormikDatePicker = (props: Props & FieldProps) => {
  const {
    form: {
      initialValues,
      setFieldValue,
      errors,
    },
    field: { name, value },
    withFocus = false,
    ...restProps
  } = props;

  const getPickerFocusState = withFocus && initialValues[name] && initialValues[name] === value;

  // # Removed all unecessary props
  const datePickerProps = omit(restProps, ['form', 'field', 'children']);

  return (
    <DatePicker
      {...datePickerProps}
      error={errors[name]}
      value={value}
      setValue={(_value: string) => setFieldValue(name, _value)}
      withFocus={getPickerFocusState}
    />
  );
};

export default React.memo(FormikDatePicker);
