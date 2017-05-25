import React from 'react';
import { connect } from 'react-redux';
import ViewLayout from '../layouts/ViewLayout';
import { actionCreators } from '../modules/index';

const mapStateToProps = ({ bonusCampaignView }) => ({
  ...bonusCampaignView,
});
export default connect(mapStateToProps, {
  ...actionCreators,
})(ViewLayout);
