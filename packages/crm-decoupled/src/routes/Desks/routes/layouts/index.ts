import { lazy } from 'react';

export const DeskProfile = lazy(() => import(`./${process.env.REACT_APP_THEME}/DeskProfile`));
export const DesksList = lazy(() => import(`./${process.env.REACT_APP_THEME}/DesksList`));
