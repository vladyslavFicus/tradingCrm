import React, { useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Helmet from 'react-helmet';
import { getBackofficeBrand, getCrmBrandStaticFileUrl } from 'config';
import CoreLayout from 'layouts/CoreLayout';
import UnauthorizedLayout from 'layouts/UnauthorizedLayout';
import AuthorizedLayout from 'layouts/AuthorizedLayout';
import NotFound from 'routes/NotFound';
import Logout from 'routes/Logout';
import SignIn from 'routes/SignIn';
import ResetPassword from 'routes/ResetPassword';
import Brands from 'routes/Brands';
import Dashboard from 'routes/Dashboard';
import TradingAccounts from 'routes/TradingAccounts';
import Clients from 'routes/Clients';
import Leads from 'routes/Leads';
import Documents from 'routes/Documents';
import Payments from 'routes/Payments';
import Hierarchy from 'routes/Hierarchy';
import Offices from 'routes/Offices';
import Desks from 'routes/Desks';
import Teams from 'routes/Teams';
import SalesRules from 'components/SalesRules';
import Operators from 'routes/Operators';
import Partners from 'routes/Partners';
import DistributionRules from 'routes/DistributionRules';
import Notifications from 'routes/Notifications';
import AcquisitionStatuses from 'routes/AcquisitionStatuses';
import EmailTemplates from 'routes/EmailTemplates';
import RolesAndPermissions from 'routes/RolesAndPermissions';
import IpWhitelist from 'routes/IpWhitelist';
import FeatureToggles from 'routes/FeatureToggles';
import PSP from 'routes/PSP';
import ReleaseNotes from 'routes/ReleaseNotes';
import TE from 'routes/TE';

const IndexRoute = () => {
  const { pathname } = useLocation();

  // Scroll to top every time when location.pathname changed
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const favicon = useMemo(() => (getCrmBrandStaticFileUrl('assets/favicon.ico')), []);

  return (
    <CoreLayout>
      <Helmet
        titleTemplate={`${getBackofficeBrand().id.toUpperCase()} | %s`}
        defaultTitle={getBackofficeBrand().id.toUpperCase()}
        link={[
          { rel: 'shortcut icon', href: favicon },
        ]}
      />

      <Routes>
        {/* Private routes */}
        <Route element={<AuthorizedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents/*" element={<Documents />} />
          <Route path="/trading-accounts" element={<TradingAccounts />} />
          <Route path="/clients/*" element={<Clients />} />
          <Route path="/leads/*" element={<Leads />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/hierarchy" element={<Hierarchy />} />
          <Route path="/offices/*" element={<Offices />} />
          <Route path="/desks/*" element={<Desks />} />
          <Route path="/teams/*" element={<Teams />} />
          <Route path="/sales-rules" element={<SalesRules />} />
          <Route path="/operators/*" element={<Operators />} />
          <Route path="/partners/*" element={<Partners />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/distribution/*" element={<DistributionRules />} />
          <Route path="/trading-engine/*" element={<TE />} />
          <Route path="/ip-whitelist/*" element={<IpWhitelist />} />
          <Route path="/release-notes" element={<ReleaseNotes />} />
          <Route path="/acquisition-statuses" element={<AcquisitionStatuses />} />
          <Route path="/email-templates/*" element={<EmailTemplates />} />
          <Route path="/roles-and-permissions/*" element={<RolesAndPermissions />} />
          <Route path="/feature-toggles/*" element={<FeatureToggles />} />
          <Route path="/psp/*" element={<PSP />} />
        </Route>

        {/* Public routes */}
        <Route element={<UnauthorizedLayout />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Choose brand route on UnauthorizedLayout with skipped authorization check */}
        <Route element={<UnauthorizedLayout skipCheck />}>
          <Route path="/brands" element={<Brands />} />
        </Route>

        {/* Common routes */}
        <Route path="/logout" element={<Logout />} />
        <Route path="/not-found" element={<NotFound />} />

        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="*" element={<Navigate replace to="/not-found" />} />
      </Routes>
    </CoreLayout>
  );
};

export default React.memo(IndexRoute);
