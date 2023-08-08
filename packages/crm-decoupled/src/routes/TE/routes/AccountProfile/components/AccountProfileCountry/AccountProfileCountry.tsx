import React from 'react';
import I18n from 'i18n-js';
import Flag from 'react-country-flag';
import { Utils } from '@crm/common';
import { Account } from '../../AccountProfile';
import './AccountProfileCountry.scss';

type Props = {
  account: Account,
}

const AccountProfileCountry = (props: Props) => {
  const { account } = props;
  const countryCode = Utils.getCountryCode(account.country as string) || '';

  return (
    <div className="AccountProfileCountry">
      <div className="AccountProfileCountry__title">
        {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.COUNTRY')}
      </div>

      <div className="AccountProfileCountry__general">
        <Choose>
          <When condition={!!countryCode}>
            <Flag
              svg
              style={{
                height: 10,
              }}
              countryCode={countryCode}
            />

            {' '}
            {Utils.countryList[countryCode]}
          </When>

          <Otherwise>
            <img src="/img/unknown-country-flag.svg" alt="unknown-country-flag" />
          </Otherwise>
        </Choose>
      </div>
    </div>
  );
};

export default React.memo(AccountProfileCountry);
