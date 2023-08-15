import React from 'react';
import { get } from 'lodash';
import { useLocation } from 'react-router-dom';
import { State } from '../../../types';
import RangeGroup from '../RangeGroup';

type Props = {
  name: string,
  children: React.ReactNode,
  className?: string,
  label?: string,
};

const DynamicRangeGroup = (props: Props) => {
  const { name, ...rest } = props;

  const state = useLocation().state as State;

  const shouldFieldRender = React.useMemo(
    () => !!get(state?.filters, name) || state?.filtersFields?.includes(name), [state?.filters, state?.filtersFields],
  );

  return (
    <If condition={!!shouldFieldRender}>
      <RangeGroup {...rest} />
    </If>
  );
};

export default React.memo(DynamicRangeGroup);
