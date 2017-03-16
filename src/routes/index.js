import onEnterStack from 'utils/onEnterStack';
import requireAuth from 'utils/requireAuth';
import BaseLayout from '../layouts/BaseLayout';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
/**
 * Routes
 */
import SignInRoute from './SignIn';
import UserProfileRoute from './UserProfile';
import OperatorProfileRoute from './Operators/routes/OperatorProfile';
import DashboardRoute from './Dashboard';
import UsersRoute from './Users';
import OperatorsRoute from './Operators';
import ProfileReviewRoute from './ProfileReview';
import PaymentsRoute from './Payments';
import BonusCampaignsRoute from './BonusCampaigns';
import BonusesRoute from './Bonuses';
import TermsRoute from './Terms';
import NotFoundRoute from './NotFound';
import LogoutRoute from './Logout';
import ReportsRoute from './Reports';

export const createRoutes = (store) => ({
  childRoutes: [
    onEnterStack({
      childRoutes: [
        UserProfileRoute(store),
        OperatorProfileRoute(store),
      ],
    }, requireAuth(store)),
    {
      component: BaseLayout,
      childRoutes: [
        SignInRoute(store),
        onEnterStack({
          component: AuthenticatedLayout,
          childRoutes: [
            DashboardRoute(store),
            UsersRoute(store),
            OperatorsRoute(store),
            ProfileReviewRoute(store),
            PaymentsRoute(store),
            BonusCampaignsRoute(store),
            BonusesRoute(store),
            TermsRoute(store),
            LogoutRoute(store),
            ReportsRoute(store),
          ],
        }, requireAuth(store)),
        NotFoundRoute(store),
      ],
    },
  ],
});

export default createRoutes;
