import { lazy } from 'react';

export const EmailTemplatesCreator = lazy(() => import('./default/EmailTemplatesCreator'));
export const EmailTemplatesEditor = lazy(() => import('./default/EmailTemplatesEditor'));
export const EmailTemplatesList = lazy(() => import('./default/EmailTemplatesList'));
