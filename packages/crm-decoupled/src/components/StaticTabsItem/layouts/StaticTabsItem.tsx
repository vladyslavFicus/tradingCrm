import React from 'react';
import { Props } from '../types';

const StaticTabsItem = (props: Props) => <>{props.children}</>;

export default React.memo(StaticTabsItem);
