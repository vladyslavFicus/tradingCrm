import React from 'react';
import { eq, get, omit } from 'lodash';
import { FieldProps, getIn } from 'formik';
import { Input } from 'components';
import { DefaultFieldProps } from '../types';

type Props = DefaultFieldProps & {
  type?: string,
  addition?: React.ReactNode,
  step?: string,
  min?: number,
  labelTooltip?: string,
  autoFocus?: boolean,
  additionPosition?: string,
  classNameError?: string,
  icon?: string,
  onAdditionClick?: (e: React.MouseEvent<HTMLInputElement>) => void,
  onEnterPress?: () => Promise<void>,
  onTruncated?: () => void,
};

const FormikInputField = (props: Props & FieldProps) => {
  const {
    field: {
      name,
      value,
      onChange,
    },
    form: {
      errors,
      initialValues,
      touched,
      setFieldTouched,
    },
    type = 'text',
    withFocus = false,
    ...input
  } = props;

  const isErrorMessageVisible = !get(initialValues, name) || get(touched, name);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await onChange(e);

    setFieldTouched(name, true);
  };

  return (
    <Input
      name={name}
      type={type}
      value={value || ''}
      error={isErrorMessageVisible && getIn(errors, name)}
      isFocused={withFocus && !!value && eq(get(initialValues, name), value)}
      onChange={handleChange}
      {...omit(input, ['staticContext'])}
    />
  );
};

export default React.memo(FormikInputField);
