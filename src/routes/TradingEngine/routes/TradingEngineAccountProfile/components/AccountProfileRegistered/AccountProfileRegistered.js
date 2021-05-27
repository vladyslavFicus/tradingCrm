import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import './AccountProfileRegistered.scss';

class AccountProfileRegistered extends PureComponent {
  render() {
    const registrationDate = '2020-07-01T04:21:12';

    return (
      <div className="AccountProfileRegistered">
        <div className="AccountProfileRegistered__title">
          {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.REGISTERED')}
        </div>

        <div className="AccountProfileRegistered__primary">
          {moment.utc(registrationDate).local().fromNow()}
        </div>
        <div className="AccountProfileRegistered__secondary">
          {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
        </div>
      </div>
    );
  }
}

export default AccountProfileRegistered;
