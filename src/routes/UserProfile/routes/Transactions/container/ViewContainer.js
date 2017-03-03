import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from '../modules/view';
import { actionCreators as paymentActionCreators } from 'redux/modules/payment';

const mapStateToProps = ({ userTransactions }) => ({
  ...userTransactions,
});
const mapActions = {
  ...viewActionCreators,
  onChangePaymentStatus: paymentActionCreators.changePaymentStatus,
  loadPaymentTransactions: paymentActionCreators.fetchTransactions,
};

export default connect(mapStateToProps, mapActions)(View);

