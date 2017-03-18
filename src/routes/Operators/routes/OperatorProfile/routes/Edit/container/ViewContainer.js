import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from '../../../modules/view';

const mapStateToProps = ({ operatorProfile: { view: operatorProfile } }) => ({
  ...operatorProfile,
});
const mapActions = {
  updateProfile: viewActionCreators.updateProfile,
};

export default connect(mapStateToProps, mapActions)(View);
