import { lazy } from 'react';

export const Partner = lazy(() => import(`./layouts/${process.env.REACT_APP_THEME}/Partner`));
export const PartnersList = lazy(() => import(`./layouts/${process.env.REACT_APP_THEME}/PartnersList`));
