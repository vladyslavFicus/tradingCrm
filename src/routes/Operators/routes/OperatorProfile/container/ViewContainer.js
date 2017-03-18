import React from 'react';
import OperatorProfileLayout from '../layouts/OperatorProfileLayout';
import { actionCreators as viewActionCreators } from '../modules/view';
import { connect } from 'react-redux';
import { statusActions } from 'constants/operators';

const mapStateToProps = ({ operatorProfile: { view: operatorProfile } }) => ({
  ...operatorProfile,
  availableStatuses: operatorProfile && operatorProfile.data
    ? statusActions[operatorProfile.data.operatorStatus]
      ? statusActions[operatorProfile.data.operatorStatus]
      : []
    : [],
});
const mapActions = {
  fetchProfile: viewActionCreators.fetchProfile,
  changeStatus: viewActionCreators.changeStatus,
};

export default connect(mapStateToProps, mapActions)(OperatorProfileLayout);
