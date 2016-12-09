import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from '../modules/view';

const mapStateToProps = (state) => ({
  ...state.userGameActivity,
  currency: state.userProfile.profile.data.currency,
  user: state.auth,
});
const mapActions = {
  ...viewActionCreators,
};

const ViewContainer = (props) => <View {...props}/>;

export default connect(mapStateToProps, mapActions)(ViewContainer);
