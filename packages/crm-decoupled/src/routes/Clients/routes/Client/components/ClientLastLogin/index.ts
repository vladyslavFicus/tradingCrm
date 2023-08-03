import { lazy } from 'react';

export default lazy(() => import(`./layouts/${process.env.REACT_APP_THEME}/ClientLastLogin`));
