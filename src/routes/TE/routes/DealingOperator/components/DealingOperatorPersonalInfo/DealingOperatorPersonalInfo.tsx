import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { PersonalInformationItem } from 'components/Information';
import { Operator } from '../../DealingOperator';
import './DealingOperatorPersonalInfo.scss';

type Props = {
  operator: Operator,
}

const DealingOperatorPersonalInfo = ({ operator }: Props) => {
  const { email, lastName, firstName, phone = '', registrationDate } = operator;

  return (
    <div className="DealingOperatorPersonalInfo">
      <div className="DealingOperatorPersonalInfo__title">
        {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.DETAILS.PERSONAL_INFORMATION')}
      </div>
      <div className="DealingOperatorPersonalInfo__content">
        <PersonalInformationItem
          label={I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.DETAILS.FIRST_NAME')}
          value={firstName}
        />
        <PersonalInformationItem
          label={I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.DETAILS.LAST_NAME')}
          value={lastName}
        />
        <PersonalInformationItem
          label={I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.DETAILS.EMAIL')}
          value={email}
        />
        <PersonalInformationItem
          label={I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.DETAILS.PHONE_NUMBER')}
          value={phone}
        />
        <PersonalInformationItem
          label={I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.DETAILS.REGISTRATION_DATE')}
          value={moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
        />
      </div>
    </div>
  );
};

export default React.memo(DealingOperatorPersonalInfo);
