import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from '../../../modules/view';
import { actionCreators as bonusActionCreators } from '../../../modules/bonus';

const mapStateToProps = (state) => ({
  ...state.userProfile,
  user: state.auth,
  bonus: state.userBonus,
});
const mapActions = {
  ...viewActionCreators,
  ...bonusActionCreators,
};

const ViewContainer = (props) => <View {...props}/>;

export default connect(mapStateToProps, mapActions)(ViewContainer);
