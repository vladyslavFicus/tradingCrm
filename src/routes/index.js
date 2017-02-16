import BaseLayout from '../layouts/BaseLayout';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
/**
 * Routes
 */
import SignInRoute from './SignIn';
import UserProfileRoute from './UserProfile';
import DashboardRoute from './Dashboard';
import UsersRoute from './Users';
import ProfileReviewRoute from './ProfileReview';
import PaymentsRoute from './Payments';
import BonusCampaignsRoute from './BonusCampaigns';
import BonusesRoute from './Bonuses';
import TermsRoute from './Terms';
import NotFoundRoute from './NotFound';
import LogoutRoute from './Logout';
import ReportsRoute from './Reports';

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
  childRoutes: [
    UserProfileRoute(store),
    {
      component: BaseLayout,
      childRoutes: [
        SignInRoute(store),
        {
          onEnter: requireAuth(store),
          component: AuthenticatedLayout,
          childRoutes: [
            DashboardRoute(store),
            UsersRoute(store),
            ProfileReviewRoute(store),
            PaymentsRoute(store),
            BonusCampaignsRoute(store),
            BonusesRoute(store),
            TermsRoute(store),
            LogoutRoute(store),
            ReportsRoute(store),
          ],
        },
        NotFoundRoute(store),
      ],
    },
  ],
});

export default createRoutes;
