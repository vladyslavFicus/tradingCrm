import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from '../modules/view';
import { actionCreators as paymentActionCreators } from 'redux/modules/payment';
import { getTransactionRejectReasons } from 'config/index';

const mapStateToProps = ({
  userTransactions,
  profile: { view: { profile }, accumulatedBalances: { data: accumulatedBalances } },
}) => ({
  ...userTransactions,
  currencyCode: profile.data.currencyCode,
  profile: profile.data,
  accumulatedBalances,
  paymentRejectReasons: getTransactionRejectReasons(),
});

const mapActions = {
  ...viewActionCreators,
  onChangePaymentStatus: paymentActionCreators.changePaymentStatus,
  loadPaymentStatuses: paymentActionCreators.fetchPaymentStatuses,
};

export default connect(mapStateToProps, mapActions)(View);
