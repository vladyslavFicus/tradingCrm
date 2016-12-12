import React from 'react';
import { connect } from 'react-redux';
import Update from '../components/Update';
import { actionCreators as createCampaignActionCreators } from '../modules/update';
import { withRouter } from 'react-router';

const mapStateToProps = ({ bonusCampaignUpdate }) => ({
  ...bonusCampaignUpdate,
});
export default withRouter(connect(mapStateToProps, { ...createCampaignActionCreators })(Update));
