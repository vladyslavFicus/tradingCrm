/* eslint-disable new-cap */
import onEnterStack from '../utils/onEnterStack';
import requireAuth from '../utils/requireAuth';
import CoreLayout from '../layouts/CoreLayout';
import NewLayout from '../layouts/NewLayout';
import BaseLayout from '../layouts/BaseLayout';
import BlackLayout from '../layouts/BlackLayout';
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
import TransactionsRoute from './Transactions';
import BonusCampaignsRoute from './BonusCampaigns';
import NewBonusCampaigns from './NewBonusCampaigns';
import NotFoundRoute from './NotFound';
import LogoutRoute from './Logout';
import ReportsRoute from './Reports';
import SettingsRoute from './Settings';
import CountriesRoute from './Countries';
import BrandsRoute from './Brands';

export default store => ({
  component: CoreLayout,
  childRoutes: [
    {
      component: BlackLayout,
      childRoutes: [
        SignInRoute(store),
        SetPasswordRoute(store),
        ResetPasswordRoute(store),
      ],
    },
    onEnterStack({
      component: BlackLayout,
      childRoutes: [
        BrandsRoute(store),
      ],
    }, requireAuth(store)),
    {
      component: BaseLayout,
      childRoutes: [
        onEnterStack({
          component: NewLayout,
          childRoutes: [
            DashboardRoute(store),
            UsersRoute(store),
            OperatorsRoute(store),
            TransactionsRoute(store),
            BonusCampaignsRoute(store),
            NewBonusCampaigns(store),
            LogoutRoute(store),
            ReportsRoute(store),
            SettingsRoute(store),
            CountriesRoute(store),
            OperatorProfileRoute(store),
          ],
        }, requireAuth(store)),
      ],
    },
    onEnterStack({
      component: PermissionLayout,
      childRoutes: [
        UserProfileRoute(store),
      ],
    }, requireAuth(store)),
    NotFoundRoute(store),
  ],
});
