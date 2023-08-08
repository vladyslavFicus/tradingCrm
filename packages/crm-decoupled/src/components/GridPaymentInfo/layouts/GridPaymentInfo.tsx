import React from 'react';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import { Payment } from '__generated__/types';
import Badge from 'components/Badge';
import Uuid from 'components/Uuid';
import useGridPaymentInfo from '../hooks/useGridPaymentInfo';
import './GridPaymentInfo.scss';

type Props = {
  payment: Payment,
  onSuccess: () => void,
};

const GridPaymentInfo = (props: Props) => {
  const { payment, onSuccess } = props;
  const { paymentId, createdBy, accountType } = payment;

  const { handleOpenDetailModal } = useGridPaymentInfo({ payment, onSuccess });

  return (
    <div id={`payment-${paymentId}`}>
      <div
        id={`transaction-${paymentId}`}
        className="GridPaymentInfo__transaction-id"
        onClick={handleOpenDetailModal}
      >
        <Badge
          text={I18n.t(`CONSTANTS.ACCOUNT_TYPE.${accountType}`)}
          info={accountType === 'DEMO'}
          success={accountType === 'LIVE'}
        >
          {Utils.uuidShortify(paymentId, 'TA')}
        </Badge>
      </div>

      <div className="GridPaymentInfo__additional">
        {I18n.t('COMMON.AUTHOR_BY')}
        <Uuid uuid={createdBy || paymentId} />
      </div>
    </div>
  );
};

export default React.memo(GridPaymentInfo);
