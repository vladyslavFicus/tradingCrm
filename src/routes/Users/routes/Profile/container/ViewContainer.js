import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from 'routes/Users/modules/view';
import { actionCreators as bonusActionCreators } from 'routes/Users/modules/bonus';

const mapStateToProps = ({ userProfile, userBonus: bonus, auth: user }) => ({
  ...userProfile,
  user,
  bonus,
});
const mapActions = {
  ...viewActionCreators,
  ...bonusActionCreators,
};

const ViewContainer = (props) => <View {...props}/>;

export default connect(mapStateToProps, mapActions)(ViewContainer);
