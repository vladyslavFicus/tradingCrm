import favicon from './assets/favicon.ico';
import logo from './assets/logo.svg';
import authBackground from './assets/auth-background.svg';

export default {
  importStyle() {
    return import('./assets/style.scss');
  },
  themeConfig: {
    logo,
    authBackground,
    favicon,
  },
};
