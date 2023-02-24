import React from 'react';
import compose from 'compose-function';
import { Switch, Redirect } from 'react-router-dom';
import Helmet from 'react-helmet';
import { getBackofficeBrand, getCrmBrandStaticFileUrl } from 'config';
import Route from 'components/Route';
import NotFound from 'routes/NotFound';
import CoreLayout from 'layouts/CoreLayout';
import UnauthorizedLayout from 'layouts/UnauthorizedLayout';
import AuthorizedLayout from 'layouts/AuthorizedLayout';
import Logout from 'routes/Logout';
import SignIn from 'routes/SignIn';
import Brands from 'routes/Brands';
import Clients from 'routes/Clients';
import Payments from 'routes/Payments';
import ResetPassword from 'routes/ResetPassword';
import Operators from 'routes/Operators';
import Partners from 'routes/Partners';
import Dashboard from 'routes/Dashboard';
import Documents from 'routes/Documents';
import Leads from 'routes/Leads';
import Hierarchy from 'routes/Hierarchy';
import Offices from 'routes/Offices';
import Desks from 'routes/Desks';
import Teams from 'routes/Teams';
import SalesRules from 'components/SalesRules';
import DistributionRules from 'routes/DistributionRules';
import TE from 'routes/TE';
import Settings from 'routes/Settings';
import ReleaseNotes from 'routes/ReleaseNotes';
import EmailTemplates from 'routes/EmailTemplates';
import TradingAccounts from 'routes/TradingAccounts';
import Notifications from 'routes/Notifications';
import RolesAndPermissions from 'routes/RolesAndPermissions';
import { withStorage } from 'providers/StorageProvider';
import IpWhitelist from 'routes/IpWhitelist';


type Auth = {
  department: string,
  role: string,
  uuid: string,
};

type Props = {
  token?: String,
  auth?: Auth,
};

const IndexRoute = (props: Props) => {
  const { token, auth } = props;

  return (
    <CoreLayout>
      <Helmet
        titleTemplate={`${getBackofficeBrand().id.toUpperCase()} | %s`}
        defaultTitle={getBackofficeBrand().id.toUpperCase()}
        link={[
          { rel: 'shortcut icon', href: getCrmBrandStaticFileUrl('assets/favicon.ico') },
        ]}
      />

      <Switch>
        <Choose>
          <When condition={!!token && !!auth}>
            <Redirect from="/sign-in" to="/dashboard" />
            <Redirect exact from="/" to="/dashboard" />
          </When>

          <Otherwise>
            <Redirect exact from="/" to="/sign-in" />
          </Otherwise>
        </Choose>

        {/* Private routes */}
        <Route path="/dashboard" layout={AuthorizedLayout} component={Dashboard} isPrivate />
        <Route path="/documents" layout={AuthorizedLayout} component={Documents} isPrivate />
        <Route path="/trading-accounts" layout={AuthorizedLayout} component={TradingAccounts} isPrivate />
        <Route path="/payments" layout={AuthorizedLayout} component={Payments} isPrivate />
        <Route path="/clients" layout={AuthorizedLayout} component={Clients} isPrivate />
        <Route path="/leads" layout={AuthorizedLayout} component={Leads} isPrivate />
        <Route path="/hierarchy" layout={AuthorizedLayout} component={Hierarchy} isPrivate />
        <Route path="/operators" layout={AuthorizedLayout} component={Operators} isPrivate />
        <Route path="/partners" layout={AuthorizedLayout} component={Partners} isPrivate />
        <Route path="/offices" layout={AuthorizedLayout} component={Offices} isPrivate />
        <Route path="/desks" layout={AuthorizedLayout} component={Desks} isPrivate />
        <Route path="/teams" layout={AuthorizedLayout} component={Teams} isPrivate />
        <Route path="/sales-rules" layout={AuthorizedLayout} component={SalesRules} isPrivate />
        <Route path="/distribution" layout={AuthorizedLayout} component={DistributionRules} isPrivate />
        <Route path="/trading-engine" layout={AuthorizedLayout} component={TE} isPrivate />
        <Route path="/ip-whitelist" layout={AuthorizedLayout} component={IpWhitelist} isPrivate />
        <Route path="/notifications" layout={AuthorizedLayout} component={Notifications} isPrivate />
        <Route path="/release-notes" layout={AuthorizedLayout} component={ReleaseNotes} isPrivate />
        <Route path="/email-templates" layout={AuthorizedLayout} component={EmailTemplates} isPrivate />
        <Route path="/roles-and-permissions" layout={AuthorizedLayout} component={RolesAndPermissions} isPrivate />
        <Route path="/settings" layout={AuthorizedLayout} component={Settings} isPrivate />
        <Route path="/logout" component={Logout} isPrivate />

        {/* Public routes */}
        <Route path="/sign-in" layout={UnauthorizedLayout} component={SignIn} isPublic />
        <Route path="/reset-password" layout={UnauthorizedLayout} component={ResetPassword} isPublic />

        {/* Common routes */}
        <Route path="/brands" layout={UnauthorizedLayout} component={Brands} />

        {/* Not found routes */}
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found" />
      </Switch>
    </CoreLayout>
  );
};

export default compose(
  React.memo,
  withStorage(['token', 'auth']),
)(IndexRoute);
