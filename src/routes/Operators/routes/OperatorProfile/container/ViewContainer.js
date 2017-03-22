import React from 'react';
import { connect } from 'react-redux';
import OperatorProfileLayout from '../layouts/OperatorProfileLayout';
import { actionCreators as ipActionCreators } from '../modules/ip';
import { actionCreators as viewActionCreators } from '../modules/view';
import { statusActions } from '../../../../../constants/operators';

const mapStateToProps = ({ operatorProfile: { view: operatorProfile, ip } }) => {
  const lastIp = ip.entities.content
    ? ip.entities.content[ip.entities.content.length - 1]
    : null;

  return {
    ...operatorProfile,
    lastIp,
    ip,
    availableStatuses: operatorProfile && operatorProfile.data
      ? statusActions[operatorProfile.data.operatorStatus]
        ? statusActions[operatorProfile.data.operatorStatus]
        : []
      : [],
  };
};
const mapActions = {
  fetchIp: ipActionCreators.fetchEntities,
  fetchProfile: viewActionCreators.fetchProfile,
  changeStatus: viewActionCreators.changeStatus,
  onResetPassword: viewActionCreators.resetPassword,
};

export default connect(mapStateToProps, mapActions)(OperatorProfileLayout);
