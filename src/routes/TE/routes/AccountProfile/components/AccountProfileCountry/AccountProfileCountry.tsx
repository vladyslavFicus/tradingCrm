import React from 'react';
import I18n from 'i18n-js';
import countryList, { getCountryCode } from 'utils/countryList';
import { Account } from '../../AccountProfile';
import './AccountProfileCountry.scss';

type Props = {
  account: Account,
}

const AccountProfileCountry = ({ account }: Props) => (
  <div className="AccountProfileCountry">
    <div className="AccountProfileCountry__title">
      {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.COUNTRY')}
    </div>
    <div className="AccountProfileCountry__primary">
      {countryList[getCountryCode(account.country)]}
    </div>
  </div>
);

export default React.memo(AccountProfileCountry);
