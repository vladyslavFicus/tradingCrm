import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { Payment } from '__generated__/types';
import { shortify } from 'utils/uuid';
import Badge from 'components/Badge';
import Uuid from 'components/Uuid';
import PaymentDetailsModal from 'modals/PaymentDetailsModal';
import './GridPaymentInfo.scss';

type Props = {
  payment: Payment,
  modals: {
    paymentDetails: Modal,
  },
  onSuccess: () => void,
};

const GridPaymentInfo = (props: Props) => {
  const {
    payment,
    onSuccess,
    modals: { paymentDetails },
  } = props;

  const { paymentId, createdBy, accountType } = payment;

  const handleOpenDetailModal = () => {
    paymentDetails.show({ payment, onSuccess });
  };

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
          {shortify(paymentId, 'TA')}
        </Badge>
      </div>

      <div className="GridPaymentInfo__additional">
        {I18n.t('COMMON.AUTHOR_BY')}
        <Uuid uuid={createdBy || paymentId} />
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    paymentDetails: PaymentDetailsModal,
  }),
)(GridPaymentInfo);
