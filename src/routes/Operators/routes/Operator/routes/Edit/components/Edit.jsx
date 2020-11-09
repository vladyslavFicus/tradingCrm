/* eslint-disable */

import React, { Component } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import renderLabel from 'utils/renderLabel';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import HierarchyProfileForm from './HierarchyProfileForm';
import DepartmentsForm from './DepartmentsForm';

const updateParentBranch = new Permissions(permissions.HIERARCHY.UPDATE_USER_BRANCH);

class View extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    profile: PropTypes.shape({
      data: PropTypes.operator,
      refetch: PropTypes.func.isRequired,
      error: PropTypes.any,
    }).isRequired,
    userHierarchy: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      userHierarchyById: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,

    permission: PropTypes.permission.isRequired,
  };

  handleRefetchHierarchy = () => this.props.userHierarchy.refetch();

  render() {
    const {
      auth: { uuid },
      userHierarchy,
      userHierarchy: { loading },
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const allowUpdateHierarchy = updateParentBranch.check(currentPermissions) && uuid !== profile.uuid;
    const initialValues = get(userHierarchy, 'userHierarchyById') || {};

    return (
      <div className="card-body">
        <HierarchyProfileForm
          operatorUUID={profile.uuid}
          operatorFullName={profile.fullName}
          loading={loading}
          initialValues={initialValues}
          allowUpdateHierarchy={allowUpdateHierarchy}
          refetchUserHierarchy={userHierarchy.refetch}
        />
      </div>
    );
  }
}

export default View;
