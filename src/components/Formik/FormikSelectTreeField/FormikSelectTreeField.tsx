import React from 'react';
import { FieldProps } from 'formik';
import SelectTree, { Props } from 'components/SelectTree';

const FormikSelectTreeField = (props: Props & FieldProps) => {
  const {
    field: {
      value,
      onChange,
    },
    ...rest
  } = props;

  return (
    <SelectTree
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default FormikSelectTreeField;
