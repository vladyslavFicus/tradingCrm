import React from 'react';
import { connect } from 'react-redux';
import Update from '../components/Update';
import { actionCreators as createCampaignActionCreators } from '../modules/update';
import { actionCreators as currenciesActionCreators } from 'redux/modules/currency';
import { withRouter } from 'react-router';

const mapStateToProps = ({ bonusCampaignUpdate, currency }) => ({
  ...bonusCampaignUpdate,
  currency,
});
export default withRouter(connect(mapStateToProps, {
  ...createCampaignActionCreators,
  loadCurrencies: currenciesActionCreators.fetchCurrencies,
})(Update));
