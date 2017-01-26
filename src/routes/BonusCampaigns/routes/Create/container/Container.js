import React from 'react';
import { connect } from 'react-redux';
import Create from '../components/Create';
import { actionCreators as createCampaignActionCreators } from '../modules/create';
import config from 'config/index';
import { withRouter } from 'react-router';

const mapStateToProps = ({ bonusCampaignCreate, currency }) => ({
  ...bonusCampaignCreate,
  currencies: config.nas.currencies.supported || [],
});
export default withRouter(connect(mapStateToProps, {
  ...createCampaignActionCreators,
})(Create));
