import React from 'react';
import { FieldProps } from 'formik';
import { SelectTree } from 'components';
import { Props } from 'types/selectTreeTypes';

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

export default React.memo(FormikSelectTreeField);
