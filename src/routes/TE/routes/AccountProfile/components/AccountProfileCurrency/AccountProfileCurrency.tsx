import React from 'react';
import I18n from 'i18n-js';
import { Account } from '../../AccountProfile';
import './AccountProfileCurrency.scss';

type Props = {
  account: Account,
}

const AccountProfileCurrency = ({ account }: Props) => (
  <div className="AccountProfileCurrency">
    <div className="AccountProfileCurrency__title">
      {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.CURRENCY')}
    </div>

    <div className="AccountProfileCurrency__primary">
      {account.currency}
    </div>
  </div>
);

export default React.memo(AccountProfileCurrency);
