import React, { Fragment } from 'react';
import { v4 } from 'uuid';
import { filterTypes } from '../attributes';
import ActionSelectOption from './ActionSelectOption';
import ViewSelectOption from './ViewSelectOption';
import DividerSelectOption from './DividerSelectOption';

const FilterSelectOption = ({ filter = { name: v4() }, ...rest }) => (
  <Fragment key={filter.uuid}>
    <If condition={filter.type === filterTypes.ACTION}>
      <ActionSelectOption data={filter} {...rest} />
    </If>
    <If condition={filter.type === filterTypes.DIVIDER}>
      <DividerSelectOption fullWidth={filter.dividerFullWidth} />
    </If>
    { /* HACK: not to map backend data, all options without type treated like VIEW */ }
    <If condition={!filter.type}>
      <ViewSelectOption data={filter} {...rest} />
    </If>
  </Fragment>
);

export default React.memo(FilterSelectOption);
