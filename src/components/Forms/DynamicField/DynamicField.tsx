import React from 'react';
import { get } from 'lodash';
import { useLocation } from 'react-router-dom';
import { Field, FieldInputProps } from 'formik';
import { State } from 'types';

type Props = FieldInputProps<string>;

const DynamicField = (props: Props) => {
  const { name } = props;

  const { state } = useLocation<State>();

  const shouldFieldRender = React.useMemo(() => {
    const fieldName = name?.split('.')[0];

    return !!get(state?.filters, fieldName) || state?.filtersFields?.includes(fieldName);
  }, [state?.filters, state?.filtersFields]);

  return (
    <If condition={shouldFieldRender}>
      <Field {...props} />
    </If>
  );
};

export default React.memo(DynamicField);
