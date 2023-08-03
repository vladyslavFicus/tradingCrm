import { lazy } from 'react';

export const DocumentsFeed = lazy(() => import(`./layouts/${process.env.REACT_APP_THEME}/DocumentsFeed`));
export const DocumentsList = lazy(() => import(`./layouts/${process.env.REACT_APP_THEME}/DocumentsList`));
