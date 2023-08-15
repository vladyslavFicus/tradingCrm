import React from 'react';
import I18n from 'i18n-js';
import { ShortLoader } from 'components';
import TabHeader from 'components/TabHeader';
import NotFound from 'routes/NotFound';
import useClientProfileTab from '../../hooks/useClientProfileTab';
import ClientPersonalForm from './components/ClientPersonalForm';
import ClientAddressForm from './components/ClientAddressForm';
import ClientKycForm from './components/ClientKycForm';
import ClientTransferForm from './components/ClientTransferForm';
import ClientContactsForm from './components/ClientContactsForm';
import AffiliateSettings from './components/AffiliateSettings';
import './ClientProfileTab.scss';

const ClientProfileTab = () => {
  const {
    profile,
    loading,
    hasAffiliate,
    showFtdToAffiliate,
    affiliateMinFtdDeposit,
    minFtdDeposit,
    allowsFtdToAffiliate,
  } = useClientProfileTab();

  if (loading) {
    return <ShortLoader />;
  }

  if (!profile) {
    return <NotFound />;
  }

  return (
    <div className="ClientProfileTab">
      <TabHeader
        title={I18n.t('CLIENT_PROFILE.TABS.PROFILE')}
        className="ClientProfileTab__header"
      />

      <div className="ClientProfileTab__content">
        <div className="ClientProfileTab__column ClientProfileTab__column--large">
          <ClientPersonalForm profile={profile} />

          <ClientAddressForm profile={profile} />

          <If condition={allowsFtdToAffiliate && hasAffiliate && (!!affiliateMinFtdDeposit || !!minFtdDeposit)}>
            <AffiliateSettings
              showFtdToAffiliate={showFtdToAffiliate}
              profileUuid={profile.uuid}
            />
          </If>
        </div>

        <div className="ClientProfileTab__column  ClientProfileTab__column--thin">
          <ClientKycForm profile={profile} />

          <ClientTransferForm profile={profile} />

          <ClientContactsForm profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ClientProfileTab);
