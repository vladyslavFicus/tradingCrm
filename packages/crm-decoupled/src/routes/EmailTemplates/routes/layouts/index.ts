import { lazy } from 'react';

export const EmailTemplatesCreator = lazy(() => import(`./${process.env.REACT_APP_THEME}/EmailTemplatesCreator`));
export const EmailTemplatesEditor = lazy(() => import(`./${process.env.REACT_APP_THEME}/EmailTemplatesEditor`));
export const EmailTemplatesList = lazy(() => import(`./${process.env.REACT_APP_THEME}/EmailTemplatesList`));
