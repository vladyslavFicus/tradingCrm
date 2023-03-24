import React, { Suspense, useEffect } from 'react';
import { Switch, Redirect, RouteComponentProps, useParams } from 'react-router-dom';
import ShortLoader from 'components/ShortLoader';
import NotFound from 'routes/NotFound';
import Route from 'components/Route';
import Tabs from 'components/Tabs';
import HideDetails from 'components/HideDetails';
import EventEmitter, { LEAD_PROMOTED, ACQUISITION_STATUS_CHANGED } from 'utils/EventEmitter';
import LeadHeader from './components/LeadHeader';
import LeadAccountStatus from './components/LeadAccountStatus';
import LeadAcquisitionStatus from './components/LeadAcquisitionStatus';
import LeadRegistrationInfo from './components/LeadRegistrationInfo';
import LeadPersonalInfo from './components/LeadPersonalInfo';
import LeadPinnedNotes from './components/LeadPinnedNotes';
import LeadProfileTab from './routes/LeadProfileTab';
import LeadCallbacksTab from './routes/LeadCallbacksTab';
import LeadFeedsTab from './routes/LeadFeedsTab';
import LeadCallHistoryTab from './routes/LeadCallHistoryTab';
import LeadNotesTab from './routes/LeadNotesTab';
import { leadTabs } from './constants';
import { useLeadProfileQuery } from './graphql/__generated__/LeadProfileQuery';
import './Lead.scss';

const Lead = ({ match: { path, url } }: RouteComponentProps) => {
  const { id: uuid } = useParams<{ id: string }>();

  // ===== Requests ===== //
  const { data, loading, refetch } = useLeadProfileQuery({ variables: { uuid } });
  const lead = data?.lead;

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(LEAD_PROMOTED, refetch);
    EventEmitter.on(ACQUISITION_STATUS_CHANGED, refetch);

    return () => {
      EventEmitter.off(LEAD_PROMOTED, refetch);
      EventEmitter.off(ACQUISITION_STATUS_CHANGED, refetch);
    };
  }, []);

  if (loading) {
    return <ShortLoader />;
  }

  if (!lead) {
    return <NotFound />;
  }

  return (
    <div className="Lead">
      <LeadHeader lead={lead} />

      <div className="Lead__content">
        <div className="Lead__info">
          <LeadAccountStatus lead={lead} />

          <LeadRegistrationInfo registrationDate={lead.registrationDate} />
        </div>

        <HideDetails>
          <div className="Lead__details">
            <LeadPersonalInfo lead={lead} />

            <LeadAcquisitionStatus lead={lead} />

            <LeadPinnedNotes uuid={lead.uuid} />
          </div>
        </HideDetails>
      </div>

      <Tabs items={leadTabs} />

      <div className="Lead__tab-content">
        <Suspense fallback={null}>
          <Switch>
            <Route
              path={`${path}/profile`}
              component={() => <LeadProfileTab lead={lead} onRefetch={refetch} />}
            />
            <Route path={`${path}/call-history`} component={LeadCallHistoryTab} />
            <Route path={`${path}/callbacks`} component={LeadCallbacksTab} />
            <Route disableScroll path={`${path}/notes`} component={LeadNotesTab} />
            <Route disableScroll path={`${path}/feeds`} component={LeadFeedsTab} />
            <Redirect to={`${url}/profile`} />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(Lead);
