import React from 'react';
import { connect } from 'react-redux';
import Create from '../components/Create';
import { actionCreators as createCampaignActionCreators } from '../modules/campaign';
import { withRouter } from 'react-router';

const mapStateToProps = (state) => ({
  ...state.bonusCampaignCreate,
});
export default withRouter(connect(mapStateToProps, { ...createCampaignActionCreators })(Create));
