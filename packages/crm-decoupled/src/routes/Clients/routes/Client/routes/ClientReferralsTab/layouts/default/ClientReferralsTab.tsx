import React from 'react';
import I18n from 'i18n-js';
import TabHeader from 'components/TabHeader';
import ClientReferralsGrid from './components/ClientReferralsGrid';

const ClientReferralsTab = () => (
  <>
    <TabHeader title={I18n.t('REFERRALS.TITLE')} />

    <ClientReferralsGrid />
  </>
);

export default React.memo(ClientReferralsTab);
