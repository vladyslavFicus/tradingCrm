import React, { useEffect } from 'react';
import { get } from 'lodash';
import { useLocation } from 'react-router-dom';
import { Field } from 'formik';
import { State } from '../../../types';
import { Option } from '../../Select';

type Props<OptionValue> = {
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
  options?: Array<Option<OptionValue>>,
};

const DynamicField = <OptionValue, >(props: Props<OptionValue>) => {
  const { name, onFetch } = props;

  const state = useLocation().state as State;

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
