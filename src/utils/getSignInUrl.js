export default (location) => {
  let returnUrl = '';

  if (location && typeof location === 'object' && location.pathname) {
    returnUrl = location.pathname;
  }

  if (returnUrl === '/' || returnUrl === '/logout') {
    returnUrl = '';
  }

  if (returnUrl !== '/sign-in') {
    return `/sign-in${returnUrl ? `?returnUrl=${returnUrl}` : ''}`;
  }
};
