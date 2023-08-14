import React from 'react';
import { eq, get, omit } from 'lodash';
import { FieldProps, getIn } from 'formik';
import { InputRange } from 'components';

type Props = {
  errorText: string,
  withFocus?: boolean,
  min?: number,
  max?: number,
};

const FormikInputRangeField = (props: Props & FieldProps) => {
  const {
    field: {
      name,
      value,
      onChange = () => {},
    },
    form: {
      errors,
      initialValues,
      setFieldError,
      setFieldValue,
    },
    withFocus = false,
    errorText,
    ...input
  } = props;

  const handleChange: ((value: number | null) => void) & React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = Number(e);

    setFieldValue(name, newValue);

    onChange(newValue);
  };

  const onError = () => {
    setFieldError(name, errorText);
  };

  return (
    <InputRange
      name={name}
      value={value || ''}
      onError={onError}
      error={getIn(errors, name)}
      isFocused={withFocus && !!value && eq(get(initialValues, name), value)}
      onChange={handleChange}
      {...omit(input, ['staticContext', 'errorText'])}
    />
  );
};

export default React.memo(FormikInputRangeField);
