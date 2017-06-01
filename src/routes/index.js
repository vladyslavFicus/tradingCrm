/* eslint-disable new-cap */
import onEnterStack from '../utils/onEnterStack';
import requireAuth from '../utils/requireAuth';
import CoreLayout from '../layouts/CoreLayout';
import NewLayout from '../layouts/NewLayout';
import BaseLayout from '../layouts/BaseLayout';
import PermissionLayout from '../layouts/PermissionLayout';
/**
 * Routes
 */
import SignInRoute from './SignIn';
import SetPasswordRoute from './SetPassword';
import ResetPasswordRoute from './ResetPassword';
import UserProfileRoute from './UserProfile';
import OperatorProfileRoute from './Operators/routes/OperatorProfile';
import DashboardRoute from './Dashboard';
import UsersRoute from './Users';
import OperatorsRoute from './Operators';
import ProfileReviewRoute from './ProfileReview';
import TransactionsRoute from './Transactions';
import PaymentMethodsRoute from './PaymentMethods';
import BonusCampaignsRoute from './BonusCampaigns';
import BonusesRoute from './Bonuses';
import TermsRoute from './Terms';
import NotFoundRoute from './NotFound';
import LogoutRoute from './Logout';
import ReportsRoute from './Reports';
import GamesRoute from './Games';
import CountriesRoute from './Countries';

export const createRoutes = store => ({
  component: CoreLayout,
  childRoutes: [
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
            TransactionsRoute(store),
            PaymentMethodsRoute(store),
            BonusCampaignsRoute(store),
            BonusesRoute(store),
            TermsRoute(store),
            LogoutRoute(store),
            ReportsRoute(store),
            GamesRoute(store),
            CountriesRoute(store),
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
