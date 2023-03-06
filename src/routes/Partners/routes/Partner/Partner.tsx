import React, { Suspense } from 'react';
import { Switch, Redirect, RouteComponentProps, useParams } from 'react-router-dom';
import { partnerTabs } from 'config/menu';
import NotFound from 'routes/NotFound';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import ShortLoader from 'components/ShortLoader';
import HideDetails from 'components/HideDetails';
import PartnerProfileTab from './routes/PartnerProfileTab';
import PartnerFeedsTab from './routes/PartnerFeedsTab';
import PartnerSalesRulesTab from './routes/PartnerSalesRulesTab';
import PartnerHeader from './components/PartnerHeader';
import PartnerAccountStatus from './components/PartnerAccountStatus';
import PartnerRegistrationInfo from './components/PartnerRegistrationInfo';
import PartnerPersonalInfo from './components/PartnerPersonalInfo';
import PartnerAdditionalInfo from './components/PartnerAdditionalInfo';
import { usePartnerQuery } from './graphql/__generated__/PartnerQuery';
import './Partner.scss';

const Partner = ({ match: { path, url } }: RouteComponentProps) => {
  const { id: uuid } = useParams<{ id: string }>();

  // ===== Requests ===== //
  const { data, loading, refetch } = usePartnerQuery({ variables: { uuid }, fetchPolicy: 'network-only' });

  const partner = data?.partner;

  if (loading) {
    return <ShortLoader />;
  }

  if (!partner) {
    return <NotFound />;
  }

  const authorities = partner.authorities || [];

  return (
    <div className="Partner">
      <PartnerHeader partner={partner} />

      <div className="Partner__content">
        <div className="Partner__info">
          <PartnerAccountStatus partner={partner} onRefetch={refetch} />

          <PartnerRegistrationInfo createdAt={partner.createdAt || ''} />
        </div>

        <HideDetails>
          <div className="Partner__details">
            <PartnerPersonalInfo partner={partner} />

            <PartnerAdditionalInfo authorities={authorities} />
          </div>
        </HideDetails>
      </div>

      <Tabs items={partnerTabs} />

      <div className="Partner__tab-content">
        <Suspense fallback={null}>
          <Switch>
            <Route
              path={`${path}/profile`}
              render={() => <PartnerProfileTab partner={partner} onRefetch={refetch} />}
            />
            <Route path={`${path}/feed`} component={PartnerFeedsTab} />
            <Route path={`${path}/sales-rules`} component={PartnerSalesRulesTab} />
            <Redirect to={`${url}/profile`} />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(Partner);
