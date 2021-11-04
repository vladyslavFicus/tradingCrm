import React, { PureComponent } from 'react';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { parse } from 'qs';
import Helmet from 'react-helmet';
import { getBackofficeBrand } from 'config';
import Route from 'components/Route';
import NotFound from 'routes/NotFound';
import CoreLayout from 'layouts/CoreLayout';
import BlackLayout from 'layouts/BlackLayout';
import MainLayout from 'layouts/MainLayout';
import Logout from 'routes/Logout';
import SignIn from 'routes/SignIn';
import Brands from 'routes/Brands';
import Clients from 'routes/Clients';
import Payments from 'routes/Payments';
import ResetPassword from 'routes/ResetPassword';
import Operators from 'routes/Operators';
import Partners from 'routes/Partners';
import Dashboard from 'routes/Dashboard';
import Leads from 'routes/Leads';
import Hierarchy from 'routes/Hierarchy';
import Offices from 'routes/Offices';
import Desks from 'routes/Desks';
import Teams from 'routes/Teams';
import SalesRules from 'components/SalesRules';
import DistributionRules from 'routes/DistributionRules';
import TradingEngineManager from 'routes/TradingEngine/TradingEngineManager';
import TradingEngineAdmin from 'routes/TradingEngine/TradingEngineAdmin';
import Callbacks from 'routes/Callbacks';
import ReleaseNotes from 'routes/ReleaseNotes';
import EmailTemplates from 'routes/EmailTemplates';
import TradingAccounts from 'routes/TradingAccounts';
import Notifications from 'routes/Notifications';
import RolesAndPermissions from 'routes/RolesAndPermissions';
import { operatorsExcludeAuthorities } from 'config/menu';
import { withStorage } from 'providers/StorageProvider';

class IndexRoute extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    token: PropTypes.string,
    auth: PropTypes.object,
  };

  static defaultProps = {
    token: null,
    auth: null,
  };

  render() {
    const { token, auth, location } = this.props;
    const search = parse(location.search, {
      ignoreQueryPrefix: true,
    });

    const returnUrl = (search && search.returnUrl) ? search.returnUrl : '/dashboard';

    return (
      <CoreLayout>
        <Helmet
          titleTemplate={`${getBackofficeBrand().id.toUpperCase()} | %s`}
          defaultTitle={getBackofficeBrand().id.toUpperCase()}
          link={[
            { rel: 'shortcut icon', href: getBackofficeBrand().themeConfig.favicon },
          ]}
        />
        <Switch>
          <Choose>
            <When condition={token && auth}>
              <Redirect from="/sign-in" to={returnUrl} />
              <Redirect exact from="/" to="/dashboard" />
            </When>
            <Otherwise>
              <Redirect exact from="/" to="/sign-in" />
            </Otherwise>
          </Choose>

          {/* Private routes */}
          <Route path="/dashboard" layout={MainLayout} component={Dashboard} isPrivate />
          <Route path="/trading-accounts" layout={MainLayout} component={TradingAccounts} isPrivate />
          <Route path="/payments" layout={MainLayout} component={Payments} isPrivate />
          <Route path="/clients" layout={MainLayout} component={Clients} isPrivate />
          <Route path="/leads" layout={MainLayout} component={Leads} isPrivate />
          <Route path="/callbacks" layout={MainLayout} component={Callbacks} isPrivate />
          <Route path="/hierarchy" layout={MainLayout} component={Hierarchy} isPrivate />
          <Route
            path="/operators"
            layout={MainLayout}
            component={Operators}
            excludeAuthorities={operatorsExcludeAuthorities}
            isPrivate
          />
          <Route path="/partners" layout={MainLayout} component={Partners} isPrivate />
          <Route path="/offices" layout={MainLayout} component={Offices} isPrivate />
          <Route path="/desks" layout={MainLayout} component={Desks} isPrivate />
          <Route path="/teams" layout={MainLayout} component={Teams} isPrivate />
          <Route path="/sales-rules" layout={MainLayout} component={SalesRules} isPrivate />
          <Route path="/distribution" layout={MainLayout} component={DistributionRules} isPrivate />
          <Route path="/trading-engine-manager" layout={MainLayout} component={TradingEngineManager} isPrivate />
          <Route path="/trading-engine-admin" layout={MainLayout} component={TradingEngineAdmin} isPrivate />
          <Route path="/notifications" layout={MainLayout} component={Notifications} isPrivate />
          <Route path="/release-notes" layout={MainLayout} component={ReleaseNotes} isPrivate />
          <Route path="/email-templates" layout={MainLayout} component={EmailTemplates} isPrivate />
          <Route path="/roles-and-permissions" layout={MainLayout} component={RolesAndPermissions} isPrivate />
          <Route path="/logout" component={Logout} isPrivate />

          {/* Public routes */}
          <Route path="/sign-in" layout={BlackLayout} component={SignIn} isPublic />
          <Route path="/reset-password" layout={BlackLayout} component={ResetPassword} isPublic />

          {/* Common routes */}
          <Route path="/brands" layout={BlackLayout} component={Brands} />

          {/* Not found routes */}
          <Route component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </CoreLayout>
    );
  }
}

export default withRouter(withStorage(['token', 'auth'])(IndexRoute));
