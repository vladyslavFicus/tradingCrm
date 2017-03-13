import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from '../modules/view';
import { actionCreators as paymentActionCreators } from 'redux/modules/payment';
import { getTransactionRejectReasons } from 'config/index';

const mapStateToProps = ({ userTransactions, profile: { bonus, view: { profile } } }) => {

  const userBalance = profile.data.balance;

  const emptyBalance = {
    amount: 0,
    currency: userBalance.currency,
  };

  return {
    ...userTransactions,
    currencyCode: profile.data.currencyCode,
    profile: profile.data,
    accumulatedBalances: {
      bonus: bonus && bonus.data ? bonus.data.balance : emptyBalance,
      real: bonus && bonus.data ? {
          amount: userBalance.amount - bonus.data.balance.amount,
          currency: userBalance.currency,
        } : userBalance,
    },
    paymentRejectReasons: getTransactionRejectReasons(),
  };
};

const mapActions = {
  ...viewActionCreators,
  onChangePaymentStatus: paymentActionCreators.changePaymentStatus,
  loadPaymentTransactions: paymentActionCreators.fetchTransactions,
};

export default connect(mapStateToProps, mapActions)(View);
