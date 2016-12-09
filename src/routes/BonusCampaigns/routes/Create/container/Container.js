import React from 'react';
import { connect } from 'react-redux';
import Create from '../components/Create';
import { actionCreators as createCampaignActionCreators } from '../modules/create';
import { withRouter } from 'react-router';

const mapStateToProps = ({ bonusCampaignCreate }) => ({
  ...bonusCampaignCreate,
});
export default withRouter(connect(mapStateToProps, { ...createCampaignActionCreators })(Create));
