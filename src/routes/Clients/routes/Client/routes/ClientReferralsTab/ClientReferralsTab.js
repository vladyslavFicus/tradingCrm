import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import TabHeader from 'components/TabHeader';
import ClientReferralsGrid from './components/ClientReferralsGrid';

class ClientReferralsTab extends PureComponent {
  render() {
    return (
      <Fragment>
        <TabHeader title={I18n.t('REFERRALS.TITLE')} />
        <ClientReferralsGrid />
      </Fragment>
    );
  }
}

export default ClientReferralsTab;
