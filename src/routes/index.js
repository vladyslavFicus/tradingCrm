/* eslint-disable new-cap */
import onEnterStack from '../utils/onEnterStack';
import requireAuth from '../utils/requireAuth';
import NewLayout from '../layouts/NewLayout';
import BaseLayout from '../layouts/BaseLayout';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import PermissionLayout from '../layouts/PermissionLayout';
/**
 * Routes
 */
import MarkupRoute from './Markup';
import SignInRoute from './SignIn';
import SetPasswordRoute from './SetPassword';
import ResetPasswordRoute from './ResetPassword';
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

export const createRoutes = store => ({
  childRoutes: [
    {
      component: NewLayout,
      childRoutes: [
        MarkupRoute(store),
      ],
    },
    {
      component: BaseLayout,
      childRoutes: [
        SignInRoute(store),
        SetPasswordRoute(store),
        ResetPasswordRoute(store),
        onEnterStack({
          component: NewLayout,
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
      ],
    },
    onEnterStack({
      component: PermissionLayout,
      childRoutes: [
        UserProfileRoute(store),
        OperatorProfileRoute(store),
      ],
    }, requireAuth(store)),
    NotFoundRoute(store),
  ],
});

export default createRoutes;
