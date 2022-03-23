import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Operator } from '../../DealingOperator';
import './DealingOperatorRegistrationInfo.scss';

type Props = {
  operator: Operator,
};

const DealingOperatorRegistrationInfo = ({ operator: { registrationDate = '' } }: Props) => (
  <div className="DealingOperatorRegistrationInfo">
    <div className="DealingOperatorRegistrationInfo__title">
      {I18n.t('COMMON.REGISTERED')}
    </div>
    <If condition={!!registrationDate}>
      <div className="DealingOperatorRegistrationInfo__primary">
        {moment.utc(registrationDate).local().fromNow()}
      </div>
      <div className="DealingOperatorRegistrationInfo__secondary">
        {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
      </div>
    </If>
  </div>
);

export default React.memo(DealingOperatorRegistrationInfo);
