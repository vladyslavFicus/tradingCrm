import BaseLayout from '../layouts/BaseLayout';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
/**
 * Routes
 */
import SignInRoute from './SignIn';
import DashboardRoute from './Dashboard';
import UsersRoute from './Users';
import TransactionsRoute from './Transactions';
import NotFoundRoute from './NotFound';
import LogoutRoute from './Logout';

export const requireAuth = (store) => (nextState, replace) => {
  const { auth } = store.getState();

  if (auth.token === null) {
    replace({
      pathname: '/sign-in',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

export const createRoutes = (store) => ({
  component: BaseLayout,
  childRoutes: [
    SignInRoute(store),
    {
      onEnter: requireAuth(store),
      component: AuthenticatedLayout,
      childRoutes: [
        DashboardRoute(store),
        UsersRoute(store),
        TransactionsRoute(store),
        LogoutRoute(store),
      ],
    },
    NotFoundRoute(store),
  ],
});

export default createRoutes;
