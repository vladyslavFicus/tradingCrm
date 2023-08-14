import React from 'react';
import { get } from 'lodash';
import { FieldProps, getIn } from 'formik';
import { TextArea } from 'components';
import { DefaultFieldProps } from '../types';

type Resize = 'none' | 'both' | 'horizontal' | 'vertical';

type Props = DefaultFieldProps & {
  maxLength?: number,
  resize?: Resize,
  helpText?: React.ReactNode,
};

const FormikTextAreaField = (props: Props & FieldProps) => {
  const {
    field: {
      name,
      value,
      onChange,
    },
    form: {
      errors,
      touched,
      initialValues,
      setFieldTouched,
    },
    ...textarea
  } = props;

  const isErrorMessageVisible = !get(initialValues, name) || get(touched, name);

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = async (e) => {
    await onChange(e);

    setFieldTouched(name, true);
  };

  return (
    <TextArea
      name={name}
      value={value || ''}
      onChange={handleChange}
      error={isErrorMessageVisible && getIn(errors, name)}
      {...textarea}
    />
  );
};

export default React.memo(FormikTextAreaField);
