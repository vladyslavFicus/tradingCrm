import React from 'react';
import { connect } from 'react-redux';
import Update from '../components/Update';
import { actionCreators as createCampaignActionCreators } from '../modules/update';
import config from 'config/index';
import { withRouter } from 'react-router';

const mapStateToProps = ({ bonusCampaignUpdate, currency }) => ({
  ...bonusCampaignUpdate,
  currencies: config.nas.currencies.supported || [],
});
export default withRouter(connect(mapStateToProps, {
  ...createCampaignActionCreators,
})(Update));
