import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { shortify } from '../../utils/uuid';
import Uuid from '../Uuid';

const GridPaymentInfo = ({ payment, onClick }) => {
  let uuidPrefix = null;

  if (payment.creatorUUID.indexOf('OPERATOR') === -1) {
    uuidPrefix = payment.creatorUUID.indexOf('PLAYER') === -1 ? 'PL' : null;
  }

  return (
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
      <div className="font-size-11">
        {I18n.t('COMMON.AUTHOR_BY')}
        {' '}
        <Uuid
          uuid={payment.creatorUUID}
          uuidPrefix={uuidPrefix}
        />
      </div>
    </div>
  );
};

GridPaymentInfo.propTypes = {
  payment: PropTypes.paymentEntity.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default GridPaymentInfo;
