import React from 'react';
import { connect } from 'react-redux';
import Create from '../components/Create';
import { actionCreators as createCampaignActionCreators } from '../modules/campaign';

const mapStateToProps = (state) => ({
  ...state.bonusCampaignCreate,
});
export default connect(mapStateToProps, { ...createCampaignActionCreators })(Create);
