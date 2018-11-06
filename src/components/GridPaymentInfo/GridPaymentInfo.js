import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import Uuid from '../../components/Uuid';
import { shortify } from '../../utils/uuid';

const GridPaymentInfo = ({ payment, onClick }) => (
  <div id={`payment-${payment.paymentId}`}>
    <button
      className="btn-transparent-text font-weight-700"
      onClick={onClick}
      id={`transaction-${payment.paymentId}`}
    >
      {shortify(payment.paymentId, 'TA')}
    </button>
    <div className="font-size-11">
      {I18n.t('COMMON.AUTHOR_BY')}
      <Uuid uuid={payment.creatorUUID} />
    </div>
  </div>
);

GridPaymentInfo.propTypes = {
  payment: PropTypes.paymentEntity.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default GridPaymentInfo;
