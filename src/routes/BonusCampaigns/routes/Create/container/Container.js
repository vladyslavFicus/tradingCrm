import React from 'react';
import { connect } from 'react-redux';
import Create from '../components/Create';
import { actionCreators as createCampaignActionCreators } from '../modules/create';
import { actionCreators as currenciesActionCreators } from 'redux/modules/currency';
import { withRouter } from 'react-router';

const mapStateToProps = ({ bonusCampaignCreate, currency }) => ({
  ...bonusCampaignCreate,
  currency,
});
export default withRouter(connect(mapStateToProps, {
  ...createCampaignActionCreators,
  loadCurrencies: currenciesActionCreators.fetchCurrencies,
})(Create));
