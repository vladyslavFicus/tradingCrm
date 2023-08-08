import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ShortLoader } from 'components';
import NotFound from 'routes/NotFound';
import Tabs from 'components/Tabs';
import HideDetails from 'components/HideDetails';
import { leadTabs } from 'routes/Leads/routes/Lead/constants/lead';
import useLead from 'routes/Leads/routes/Lead/hooks/useLead';
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
import './Lead.scss';

const Lead = () => {
  const {
    lead,
    loading,
    refetch,
  } = useLead();

  if (loading) {
    return <ShortLoader />;
  }

  if (!lead) {
    return <NotFound />;
  }

  return (
    <div className="Lead">
      <LeadHeader lead={lead} onRefetch={refetch} />

      <div className="Lead__content">
        <div className="Lead__info">
          <LeadAccountStatus lead={lead} />

          <LeadRegistrationInfo registrationDate={lead.registrationDate} />
        </div>

        <HideDetails>
          <div className="Lead__details">
            <LeadPersonalInfo lead={lead} />

            <LeadAcquisitionStatus lead={lead} onRefetch={refetch} />

            <LeadPinnedNotes uuid={lead.uuid} />
          </div>
        </HideDetails>
      </div>

      <Tabs items={leadTabs} />

      <div className="Lead__tab-content">
        <Suspense fallback={null}>
          <Routes>
            <Route path="profile" element={<LeadProfileTab lead={lead} onRefetch={refetch} />} />
            <Route path="call-history" element={<LeadCallHistoryTab />} />
            <Route path="callbacks" element={<LeadCallbacksTab />} />
            <Route path="notes" element={<LeadNotesTab />} />
            <Route path="feeds" element={<LeadFeedsTab />} />
            <Route path="*" element={<Navigate replace to="profile" />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(Lead);
