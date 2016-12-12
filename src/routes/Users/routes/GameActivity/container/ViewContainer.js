import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from '../modules/view';

const mapStateToProps = ({ userGameActivity, userProfile }) => ({
  ...userGameActivity,
  currency: userProfile.profile.data.currency,
});
const mapActions = {
  ...viewActionCreators,
};

const ViewContainer = (props) => <View {...props}/>;

export default connect(mapStateToProps, mapActions)(ViewContainer);
