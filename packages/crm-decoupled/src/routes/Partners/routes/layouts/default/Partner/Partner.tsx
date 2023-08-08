import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ShortLoader } from 'components';
import NotFound from 'routes/NotFound';
import Tabs from 'components/Tabs';
import HideDetails from 'components/HideDetails';
import usePartner from 'routes/Partners/routes/hooks/usePartner';
import { partnerTabs } from './constants';
import PartnerProfileTab from './routes/PartnerProfileTab';
import PartnerFeedsTab from './routes/PartnerFeedsTab';
import PartnerSalesRulesTab from './routes/PartnerSalesRulesTab';
import PartnerHeader from './components/PartnerHeader';
import PartnerAccountStatus from './components/PartnerAccountStatus';
import PartnerRegistrationInfo from './components/PartnerRegistrationInfo';
import PartnerPersonalInfo from './components/PartnerPersonalInfo';
import PartnerAdditionalInfo from './components/PartnerAdditionalInfo';
import './Partner.scss';

const Partner = () => {
  const {
    partner,
    isNotPartner,
    loading,
    refetch,
  } = usePartner();

  if (loading) {
    return <ShortLoader />;
  }

  if (isNotPartner) {
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
          <Routes>
            <Route path="profile" element={<PartnerProfileTab partner={partner} onRefetch={refetch} />} />
            <Route path="feed" element={<PartnerFeedsTab />} />
            <Route path="sales-rules" element={<PartnerSalesRulesTab />} />
            <Route path="*" element={<Navigate replace to="profile" />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(Partner);
