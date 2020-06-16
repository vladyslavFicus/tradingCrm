import React, { Component } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import renderLabel from 'utils/renderLabel';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
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
      data: PropTypes.operatorProfile,
      error: PropTypes.any,
    }).isRequired,
    userHierarchy: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      hierarchy: PropTypes.shape({
        userHierarchyById: PropTypes.shape({
          data: PropTypes.object,
          error: PropTypes.object,
        }),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    deleteAuthority: PropTypes.func.isRequired,
    authorities: PropTypes.oneOfType([PropTypes.authorityEntity, PropTypes.object]),
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
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
      match: { params: { id: operatorUUID } }, deleteAuthority, notify,
    } = this.props;

    try {
      await deleteAuthority({
        variables: {
          uuid: operatorUUID,
          department,
          role,
        },
      });

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
      profile: { data: profile },
      authorities,
      auth: { uuid },
      departmentsRoles,
      userHierarchy: {
        loading,
        hierarchy,
      },
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const allowEditPermissions = manageDepartmentsPermission.check(currentPermissions) && uuid !== profile.uuid;
    const allowUpdateHierarchy = updateParentBranch.check(currentPermissions) && uuid !== profile.uuid;
    const initialValues = get(hierarchy, 'userHierarchyById.data') || {};

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
              authorities.data ? authorities.data.map(authority => (
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
              )) : null
            }
            <If condition={allowEditPermissions && departmentsRoles}>
              <DepartmentsForm
                authorities={authorities.data || []}
                departmentsRoles={departmentsRoles}
                operatorUuid={profile.uuid}
              />
            </If>
          </div>
        </div>
        <HierarchyProfileForm
          loading={loading}
          initialValues={initialValues}
          allowUpdateHierarchy={allowUpdateHierarchy}
        />
      </div>
    );
  }
}

export default withPermission(View);
