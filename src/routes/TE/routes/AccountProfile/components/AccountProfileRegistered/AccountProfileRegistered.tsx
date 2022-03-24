import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Account } from '../../AccountProfile';
import './AccountProfileRegistered.scss';

type Props = {
  account: Account,
}

const AccountProfileRegistered = ({ account }: Props) => (
  <div className="AccountProfileRegistered">
    <div className="AccountProfileRegistered__title">
      {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.REGISTERED')}
    </div>

    <div className="AccountProfileRegistered__primary">
      {moment.utc(account.registrationDate).local().fromNow()}
    </div>
    <div className="AccountProfileRegistered__secondary">
      {I18n.t('COMMON.ON')} {moment.utc(account.registrationDate).local().format('DD.MM.YYYY HH:mm')}
    </div>
  </div>
);

export default React.memo(AccountProfileRegistered);
