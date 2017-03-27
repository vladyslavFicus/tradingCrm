import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from 'routes/UserProfile/modules/view';
import { actionCreators as bonusActionCreators } from 'routes/UserProfile/modules/bonus';
import { actionCreators as kycActionCreators } from '../modules/kyc';

const mapStateToProps = ({ profile: { view: userProfile, bonus } }) => ({
  ...userProfile,
  bonus,
});
const mapActions = {
  ...viewActionCreators,
  ...bonusActionCreators,
  verifyIdentity: kycActionCreators.verifyIdentity,
  refuseIdentity: kycActionCreators.refuseIdentity,
};

export default connect(mapStateToProps, mapActions)(View);
