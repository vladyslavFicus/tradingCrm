import React, { PureComponent, Fragment } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { parse } from 'qs';
import { AppRoute, Route } from 'router';
import Helmet from 'react-helmet';
import { getBackofficeBrand } from 'config';
import NotFound from 'routes/NotFound';
import CoreLayout from 'layouts/CoreLayout';
import BlackLayout from 'layouts/BlackLayout';
import MainLayout from 'layouts/MainLayout';
import SignIn from 'routes/SignIn';
import Logout from 'routes/Logout';
import Brands from 'routes/Brands';
import Clients from 'routes/Clients';
import Payments from 'routes/Payments';
import SetPassword from 'routes/SetPassword';
import ResetPassword from 'routes/ResetPassword';
import Operators from 'routes/Operators';
import Partners from 'routes/Partners';
import Dashboard from 'routes/Dashboard';
import Leads from 'routes/Leads';
import Hierarchy from 'routes/Hierarchy';
import Offices from 'routes/Offices';
import Desks from 'routes/Desks';
import Teams from 'routes/Teams';
import SalesRules from 'routes/SalesRules';
import Callbacks from 'routes/Callbacks';
import ReleaseNotes from 'routes/ReleaseNotes';
import PersonalDashboard from 'routes/PersonalDashboard';
import { operatorsExcludeAuthorities } from 'config/menu';

class IndexRoute extends PureComponent {
  static propTypes = {
    logged: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
  };

  render() {
    const { logged, location } = this.props;
    const search = parse(location.search, {
      ignoreQueryPrefix: true,
    });
    const returnUrl = (search && search.returnUrl) ? search.returnUrl : '/';

    return (
      <CoreLayout>
        <Fragment>
          <Helmet
            titleTemplate={`${getBackofficeBrand().id.toUpperCase()} | %s`}
            defaultTitle={getBackofficeBrand().id.toUpperCase()}
            link={[
              { rel: 'shortcut icon', href: getBackofficeBrand().themeConfig.favicon },
            ]}
          />
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
            <AppRoute path="/dashboard" layout={MainLayout} component={Dashboard} checkAuth />
            <AppRoute path="/personal-dashboard" layout={MainLayout} component={PersonalDashboard} checkAuth />
            <AppRoute path="/payments" layout={MainLayout} component={Payments} checkAuth />
            <AppRoute path="/clients" layout={MainLayout} component={Clients} checkAuth />
            <AppRoute path="/leads" layout={MainLayout} component={Leads} checkAuth />
            <AppRoute path="/callbacks" layout={MainLayout} component={Callbacks} checkAuth />
            <AppRoute path="/hierarchy" layout={MainLayout} component={Hierarchy} checkAuth />
            <AppRoute
              path="/operators"
              layout={MainLayout}
              component={Operators}
              excludeAuthorities={operatorsExcludeAuthorities}
              checkAuth
            />
            <AppRoute path="/partners" layout={MainLayout} component={Partners} checkAuth />
            <AppRoute path="/offices" layout={MainLayout} component={Offices} checkAuth />
            <AppRoute path="/desks" layout={MainLayout} component={Desks} checkAuth />
            <AppRoute path="/teams" layout={MainLayout} component={Teams} checkAuth />
            <AppRoute path="/sales-rules" layout={MainLayout} component={SalesRules} checkAuth />
            <AppRoute path="/release-notes" layout={MainLayout} component={ReleaseNotes} checkAuth />
            <Route path="/logout" component={Logout} />
            {/* Public */}
            <AppRoute path="/sign-in" layout={BlackLayout} component={SignIn} />
            <AppRoute path="/set-password" layout={BlackLayout} component={SetPassword} />
            <AppRoute path="/reset-password" layout={BlackLayout} component={ResetPassword} />
            <Route component={NotFound} />
          </Switch>
        </Fragment>
      </CoreLayout>
    );
  }
}

export default IndexRoute;
