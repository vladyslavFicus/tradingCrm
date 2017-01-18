import React from 'react';
import { connect } from 'react-redux';
import Create from '../components/Create';
import { actionCreators as bonusActionCreators } from '../modules/create';
import { actionCreators as profileActionCreators } from 'routes/Users/modules/view';
import { actionCreators as currenciesActionCreators } from 'redux/modules/currency';
import { withRouter } from 'react-router';

const mapStateToProps = ({ bonusCreate, currency }) => ({
  ...bonusCreate,
  currency,
});
export default withRouter(connect(mapStateToProps, {
  ...bonusActionCreators,
  fetchProfile: profileActionCreators.fetchProfile,
  loadCurrencies: currenciesActionCreators.fetchCurrencies,
})(Create));
