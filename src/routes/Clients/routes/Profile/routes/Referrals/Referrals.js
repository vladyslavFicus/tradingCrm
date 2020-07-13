import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import TabHeader from 'components/TabHeader';
import ReferralsGrid from './components/ReferralsGrid';
import ReferralsQuery from './graphql/ReferralsQuery';

class Referrals extends PureComponent {
  static propTypes = {
    referralsQuery: PropTypes.query({
      referrals: PropTypes.pageable(PropTypes.referral),
    }).isRequired,
  };

  render() {
    const { referralsQuery } = this.props;

    return (
      <Fragment>
        <TabHeader title={I18n.t('REFERRALS.TITLE')} />
        <ReferralsGrid referralsQuery={referralsQuery} />
      </Fragment>
    );
  }
}

export default withRequests({
  referralsQuery: ReferralsQuery,
})(Referrals);
