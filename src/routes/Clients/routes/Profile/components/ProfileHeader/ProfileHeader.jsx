/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'constants/propTypes';
import Balances from '../Balances';

class ProfileHeader extends Component {
  static propTypes = {
    profile: PropTypes.profile,
  };

  static defaultProps = {
    profile: {},
  };

  render() {
    const {
      profile,
    } = this.props;

    const {
      uuid,
      profileView,
      tradingAccounts,
      registrationDetails,
    } = profile;

    const registrationDate = registrationDetails?.registrationDate;

    const { balance } = profileView || {};

    return (
      <Balances
        clientRegistrationDate={registrationDate}
        balances={{
          amount: balance.amount,
          credit: balance.credit,
        }}
        tradingAccounts={tradingAccounts && tradingAccounts.filter(account => account.accountType !== 'DEMO')}
        uuid={uuid}
      />
    );
  }
}

export default ProfileHeader;
