import React, { Component } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import renderLabel from 'utils/renderLabel';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import HierarchyProfileForm from './HierarchyProfileForm';
import OperatorPersonalForm from './OperatorPersonalForm';
import DepartmentsForm from './DepartmentsForm';

const manageDepartmentsPermission = new Permissions([
  permissions.OPERATORS.ADD_AUTHORITY,
  permissions.OPERATORS.DELETE_AUTHORITY,
]);

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
    deleteAuthority: PropTypes.func.isRequired,
    authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    auth: PropTypes.shape({
      uuid: PropTypes.string,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  static childContextTypes = {
    refetchHierarchy: PropTypes.func.isRequired,
  };

  static defaultProps = {
    authorities: [],
    departmentsRoles: {},
  };

  getChildContext() {
    return {
      refetchHierarchy: this.handleRefetchHierarchy,
    };
  }

  get readOnly() {
    const permittedRights = [permissions.OPERATORS.UPDATE_PROFILE];

    return !(new Permissions(permittedRights).check(this.props.permission.permissions));
  }

  handleRefetchHierarchy = () => this.props.userHierarchy.refetch();

  handleDeleteAuthority = async (department, role) => {
    const {
      deleteAuthority,
      notify,
      profile,
      match: { params: { id: operatorUUID } },
    } = this.props;

    try {
      await deleteAuthority({
        variables: {
          uuid: operatorUUID,
          department,
          role,
        },
      });

      profile.refetch();

      notify({
        level: 'success',
        title: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_SUCCESS.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_SUCCESS.MESSAGE'),
      });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.MESSAGE'),
      });
    }
  };

  render() {
    const {
      profile: { data: profile, refetch },
      authorities,
      auth: { uuid },
      departmentsRoles,
      userHierarchy,
      userHierarchy: { loading },
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const allowEditPermissions = manageDepartmentsPermission.check(currentPermissions) && uuid !== profile.uuid;
    const allowUpdateHierarchy = updateParentBranch.check(currentPermissions) && uuid !== profile.uuid;
    const initialValues = get(userHierarchy, 'userHierarchyById') || {};

    if (departmentsRoles) {
      delete departmentsRoles.AFFILIATE_PARTNER;
      delete departmentsRoles.E2E;
    }

    return (
      <div className="card-body">
        <div className="card">
          <div className="card-body">
            <OperatorPersonalForm
              operatorProfile={profile}
              disabled={this.readOnly}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="personal-form-heading margin-bottom-20">
              {I18n.t('OPERATORS.PROFILE.DEPARTMENTS.LABEL')}
            </div>
            {
              authorities.map(authority => (
                <div key={authority.id} className="margin-bottom-20">
                  <strong>
                    {I18n.t(renderLabel(authority.department, departmentsLabels))}
                    {' - '}
                    {I18n.t(renderLabel(authority.role, rolesLabels))}
                  </strong>
                  <If condition={allowEditPermissions}>
                    <strong className="margin-left-20">
                      <i
                        onClick={() => this.handleDeleteAuthority(authority.department, authority.role)}
                        className="fa fa-trash cursor-pointer color-danger"
                      />
                    </strong>
                  </If>
                </div>
              ))
            }
            <If condition={allowEditPermissions && departmentsRoles}>
              <DepartmentsForm
                authorities={authorities}
                departmentsRoles={departmentsRoles}
                operatorUuid={profile.uuid}
                onSuccess={refetch}
              />
            </If>
          </div>
        </div>
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
