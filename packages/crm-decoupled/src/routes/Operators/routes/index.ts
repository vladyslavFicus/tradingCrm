import { lazy } from 'react';

export const Operator = lazy(() => import(`./layouts/${process.env.REACT_APP_THEME}/Operator`));
export const OperatorsList = lazy(() => import(`./layouts/${process.env.REACT_APP_THEME}/OperatorsList`));
