import React from 'react';
import { FieldProps, getIn } from 'formik';
import { Checkbox } from 'components';
import { DefaultFieldProps } from '../types';

type Props = DefaultFieldProps & {
  vertical?: boolean,
  hint?: string,
};

const FormikCheckbox = (props: Props & FieldProps) => {
  const {
    field: {
      value,
      name,
    },
    form: {
      errors,
      setFieldValue,
    },
    ...rest
  } = props;

  const checkBoxProps = {
    name,
    value,
    onChange: () => setFieldValue(name, !value),
    error: getIn(errors, name),
    ...rest,
  };

  return (
    <Checkbox {...checkBoxProps} />
  );
};

export default React.memo(FormikCheckbox);
