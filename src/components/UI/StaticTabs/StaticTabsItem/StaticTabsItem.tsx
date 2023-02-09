import React from 'react';

export type Props = {
  label: string, // eslint-disable-line react/no-unused-prop-types
  children: React.ReactNode,
};

const StaticTabsItem = (props: Props) => <>{props.children}</>;

export default React.memo(StaticTabsItem);
