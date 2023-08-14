import React from 'react';
import { FieldProps } from 'formik';
import { SelectTree } from 'components';

type Node = {
  value: string,
  label: string,
  children?: Node[],
  showCheckbox?: boolean,
};

type Props = {
  label?: string,
  value?: string,
  disabled?: boolean,
  className?: string,
  onChange?: (value: string | string[]) => void,
  nodes: Node[],
  favorites?: string[],
};

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
