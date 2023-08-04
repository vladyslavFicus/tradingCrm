import React from 'react';
import { eq, get, omit } from 'lodash';
import { FieldProps } from 'formik';
import InputDecimals from 'components/InputDecimals';
import { DefaultFieldProps } from '../types';

type Props = DefaultFieldProps & {
  step: string,
  decimalsWarningMessage: string,
  decimalsLimit?: number,
  decimalsLengthDefault?: number,
  min?: number,
  max?: number,
};

const FormikInputDecimalsField = (props: Props & FieldProps) => {
  const {
    field: {
      name,
      value,
    },
    form: {
      errors,
      initialValues,
      setFieldValue,
    },
    withFocus = false,
    ...input
  } = props;

  const handleInputChange = (newValue: number | string) => {
    setFieldValue(name, newValue);
  };

  return (
    <InputDecimals
      name={name}
      value={value || ''}
      onChange={handleInputChange}
      error={get(errors, name)}
      isFocused={withFocus && !!value && eq(get(initialValues, name), value)}
      {...omit(input, ['staticContext'])}
    />
  );
};

export default React.memo(FormikInputDecimalsField);
