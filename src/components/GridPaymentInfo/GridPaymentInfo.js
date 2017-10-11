import React from 'react';
import PropTypes from '../../constants/propTypes';
import { shortify } from '../../utils/uuid';

const GridPaymentInfo = ({ payment, onClick }) => (
  <div id={`payment-${payment.paymentId}`}>
    <div className="font-weight-700">
      <button
        className="btn-transparent-text"
        onClick={onClick}
        id={`transaction-${payment.paymentId}`}
      >
        {shortify(payment.paymentId, 'TA')}
      </button>
    </div>
  </div>
);

GridPaymentInfo.propTypes = {
  payment: PropTypes.paymentEntity.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default GridPaymentInfo;
