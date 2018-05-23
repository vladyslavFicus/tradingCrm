import history from '../router/history';

export default () => {
  let returnUrl = history.location.pathname;

  if (returnUrl === '/' || returnUrl === '/logout') {
    returnUrl = '';
  }

  if (returnUrl !== '/sign-in') {
    return `/sign-in${returnUrl ? `?returnUrl=${returnUrl}` : ''}`;
  }
};
