import React, { PureComponent } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { parse } from 'qs';
import { AppRoute, Route } from '../../../router';
import NotFound from '../../../routes/NotFound';
import CoreLayout from '../../../layouts/CoreLayout';
import BlackLayout from '../../../layouts/BlackLayout';
import MainLayout from '../../../layouts/MainLayout';
import SignIn from '../../SignIn';
import Logout from '../../Logout';
import Brands from '../../Brands';
import Clients from '../../Clients';
import Payments from '../../Payments';
import Settings from '../../Settings';
import SetPassword from '../../SetPassword';
import ResetPassword from '../../ResetPassword';
import Operators from '../../Operators';
import Dashboard from '../../Dashboard';
import Leads from '../../Leads';
import Offices from '../../Offices';
import Desks from '../../Desks';
import Teams from '../../Teams';
import Callbacks from '../../Callbacks';
/* ------------- folders to delete ------------------- */
// import Players from '../../Players';
// import Transactions from '../../Transactions';
// import Campaigns from '../../Campaigns';
// import ConditionalTags from '../../ConditionalTags';
// import Reports from '../../Reports';
// import BonusCampaigns from '../../BonusCampaigns';

class IndexRoute extends PureComponent {
  static propTypes = {
    logged: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    isAdministration: PropTypes.bool.isRequired,
  };

  render() {
    const { logged, location, isAdministration } = this.props;
    const search = parse(location.search, {
      ignoreQueryPrefix: true,
    });
    const returnUrl = (search && search.returnUrl) ? search.returnUrl : '/';

    return (
      <CoreLayout>
        <Switch>
          <Choose>
            <When condition={logged}>
              <Redirect from="/sign-in" to={returnUrl} />
              <Redirect from="/(set-password|reset-password)" to="/" />
              <Redirect exact from="/" to="/dashboard" />
            </When>
            <Otherwise>
              <Redirect exact from="/" to="/sign-in" />
            </Otherwise>
          </Choose>
          {/* Private */}
          <AppRoute path="/brands" layout={BlackLayout} component={Brands} checkAuth />
          <AppRoute path="/settings" layout={MainLayout} component={Settings} checkAuth />
          <AppRoute path="/dashboard" layout={MainLayout} component={Dashboard} checkAuth />
          <AppRoute path="/payments" layout={MainLayout} component={Payments} checkAuth />
          <AppRoute path="/clients" layout={MainLayout} component={Clients} checkAuth />
          <AppRoute path="/leads" layout={MainLayout} component={Leads} checkAuth />
          <AppRoute path="/callbacks" layout={MainLayout} component={Callbacks} checkAuth />
          <If condition={isAdministration}>
            <AppRoute path="/operators" layout={MainLayout} component={Operators} checkAuth />
            <AppRoute path="/offices" layout={MainLayout} component={Offices} checkAuth />
            <AppRoute path="/desks" layout={MainLayout} component={Desks} checkAuth />
            <AppRoute path="/teams" layout={MainLayout} component={Teams} checkAuth />
          </If>
          <Route path="/logout" component={Logout} />
          {/* Public */}
          <AppRoute path="/sign-in" layout={BlackLayout} component={SignIn} />
          <AppRoute path="/set-password" layout={BlackLayout} component={SetPassword} />
          <AppRoute path="/reset-password" layout={BlackLayout} component={ResetPassword} />
          <Route component={NotFound} />
        </Switch>
      </CoreLayout>
    );
  }
}

export default IndexRoute;
