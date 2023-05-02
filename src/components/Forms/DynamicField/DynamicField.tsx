import React, { useEffect } from 'react';
import { get } from 'lodash';
import { useLocation } from 'react-router-dom';
import { Field } from 'formik';
import { State } from 'types';

type Props = {
  name: string,
  className?: string,
  label?: string,
  labelTooltip?: string,
  placeholder?: string,
  addition?: React.ReactNode,
  component?: React.ReactNode,
  maxLength?: number,
  withFocus?: boolean,
  children?: React.ReactNode,
  withAnyOption?: boolean,
  searchable?: boolean,
  multiple?: boolean,
  disabled?: boolean,
  type?: string,
  step?: string,
  min?: number,
  anchorDirection?: string,
  fieldsNames?: {
    from: string,
    to: string,
  },
  onFetch?: () => void,
};

const DynamicField = (props: Props) => {
  const { name, onFetch } = props;

  const { state } = useLocation<State>();

  const shouldFieldRender = React.useMemo(() => {
    const fieldName = name?.split('.')[0];

    return !!get(state?.filters, fieldName) || state?.filtersFields?.includes(fieldName);
  }, [state?.filters, state?.filtersFields]);

  useEffect(() => {
    if (shouldFieldRender && onFetch) {
      onFetch();
    }
  }, [shouldFieldRender]);

  return (
    <If condition={!!shouldFieldRender}>
      <Field {...props} />
    </If>
  );
};

export default React.memo(DynamicField);
