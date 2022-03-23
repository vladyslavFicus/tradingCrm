import React from 'react';
import I18n from 'i18n-js';
import { Operator } from '../../DealingOperator';
import './DealingOperatorAdditionalInfo.scss';

type Props = {
  operator: Operator,
}


const DealingOperatorAdditionalInfo = ({ operator: { role } }: Props) => (
  <div className="DealingOperatorAdditionalInfo">
    <div className="DealingOperatorAdditionalInfo__title">
      {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.DETAILS.ADDITIONAL_INFORMATION')}
    </div>
    <div className="DealingOperatorAdditionalInfo__content">
      <div className="DealingOperatorAdditionalInfo__content-title">
        {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.DETAILS.ROLE')}
      </div>
      <div className="DealingOperatorAdditionalInfo__authorities">
        <div className="DealingOperatorAdditionalInfo__authority">
          <div className="DealingOperatorAdditionalInfo__authority-role">
            {I18n.t(role)}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default React.memo(DealingOperatorAdditionalInfo);
