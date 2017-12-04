import React from 'react';
import PropTypes from '../../constants/propTypes';
import renderPaymentAccount from '../../utils/renderPaymentAccount';

const PaymentAccount = ({ account }) => (
  <span className="payment-account">
    {renderPaymentAccount(account)}
  </span>
);
PaymentAccount.propTypes = {
  account: PropTypes.string.isRequired,
};

export default PaymentAccount;
