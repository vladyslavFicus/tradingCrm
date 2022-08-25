import React from 'react';
import I18n from 'i18n-js';
import Flag from 'react-country-flag';
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
      <Choose>
        <When condition={getCountryCode(account.country)}>
          <Flag
            svg
            style={{
              height: 10,
            }}
            countryCode={getCountryCode(account.country)}
          />
          {' '}
          {countryList[getCountryCode(account.country)]}
        </When>
        <Otherwise>
          <img src="/img/unknown-country-flag.svg" alt="" />
        </Otherwise>
      </Choose>
    </div>
  </div>
);

export default React.memo(AccountProfileCountry);
