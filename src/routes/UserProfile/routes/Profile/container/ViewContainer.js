import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from 'routes/UserProfile/modules/view';
import { actionCreators as bonusActionCreators } from 'routes/UserProfile/modules/bonus';

const mapStateToProps = ({ profile: { view: userProfile, bonus }, auth: user }) => ({
  ...userProfile,
  user,
  bonus,
});
const mapActions = {
  ...viewActionCreators,
  ...bonusActionCreators,
};

export default connect(mapStateToProps, mapActions)(View);
