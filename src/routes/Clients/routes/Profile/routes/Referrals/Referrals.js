import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import TabHeader from 'components/TabHeader';
import ReferralsGrid from './components/ReferralsGrid';

class Referrals extends PureComponent {
  render() {
    return (
      <Fragment>
        <TabHeader title={I18n.t('REFERRALS.TITLE')} />
        <ReferralsGrid />
      </Fragment>
    );
  }
}

export default Referrals;
