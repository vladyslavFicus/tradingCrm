import React from 'react';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import Amount from '../Amount';
import { types as paymentTypes } from '../../constants/payment';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';

const GridPaymentInfo = ({ payment }) => {
  const negativeOperation = [paymentTypes.Withdraw, paymentTypes.Confiscate].indexOf(payment.paymentType) !== -1;
  const className = classNames('font-weight-700', { 'color-danger': negativeOperation });

  return (
    <div className={className}>
      <div>{negativeOperation && '-'}<Amount {...payment.amount} /></div>
      {
        payment.amountBarrierReached &&
        <div>
          <span className="color-primary" id={`grid-payment-info-${payment.paymentId}-mga-limit`}>
            {I18n.t('COMMON.MGA_LIMIT')}
          </span>
          <UncontrolledTooltip target={`grid-payment-info-${payment.paymentId}-mga-limit`} placement="right">
            <span>{I18n.t('COMMON.MGA_LIMIT_DESCRIPTION')}</span>
          </UncontrolledTooltip>
        </div>
      }
    </div>
  );
};

GridPaymentInfo.propTypes = {
  payment: PropTypes.paymentEntity.isRequired,
};

export default GridPaymentInfo;
