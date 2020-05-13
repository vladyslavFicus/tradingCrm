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
import PersonalForm from './PersonalForm';
import DepartmentsForm from './DepartmentsForm';

const manageDepartmentsPermission = new Permissions([
  permissions.OPERATORS.ADD_AUTHORITY,
  permissions.OPERATORS.DELETE_AUTHORITY,
]);

const updateParentBranch = new Permissions(permissions.HIERARCHY.UPDATE_USER_BRANCH);

class View extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired,
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
    allowedIpAddresses: PropTypes.arrayOf(PropTypes.string),
    forbiddenCountries: PropTypes.arrayOf(PropTypes.string),
    showNotes: PropTypes.bool,
    showSalesStatus: PropTypes.bool,
    showFTDAmount: PropTypes.bool,
    deleteAuthority: PropTypes.func.isRequired,
    addAuthority: PropTypes.func.isRequired,
    operatorType: PropTypes.string,
    authorities: PropTypes.oneOfType([PropTypes.authorityEntity, PropTypes.object]),
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    auth: PropTypes.shape({
      uuid: PropTypes.string,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  static defaultProps = {
    operatorType: '',
    showNotes: false,
    showSalesStatus: false,
    showFTDAmount: false,
    authorities: [],
    allowedIpAddresses: [],
    forbiddenCountries: [],
  };

  static childContextTypes = {
    refetchHierarchy: PropTypes.func.isRequired,
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

  handleSubmit = async (data) => {
    const {
      match: { params: { id: operatorUUID } },
      updateProfile,
      notify,
    } = this.props;

    const { data: { operator: { updateOperator: { error } } } } = await updateProfile({
      variables: {
        uuid: operatorUUID,
        ...data,
      },
    });

    notify({
      level: error ? 'error' : 'success',
      title: error
        ? I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_ERROR.TITLE')
        : I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_SUCCESS.TITLE'),
      message: error
        ? I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_ERROR.MESSAGE')
        : I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_SUCCESS.MESSAGE'),
    });
  };

  handleDeleteAuthority = async (department, role) => {
    const {
      match: { params: { id: operatorUUID } }, deleteAuthority, notify,
    } = this.props;

    const { data: { operator: { removeDepartment: { error } } } } = await deleteAuthority({
      variables: {
        uuid: operatorUUID,
        department,
        role,
      },
    });

    notify({
      level: error ? 'error' : 'success',
      title: error
        ? I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.TITLE')
        : I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_SUCCESS.TITLE'),
      message: error
        ? I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.MESSAGE')
        : I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_SUCCESS.MESSAGE'),
    });
  };

  handleAddAuthority = async ({
    department,
    role,
  }) => {
    const {
      match: { params: { id: operatorUUID } }, addAuthority, notify,
    } = this.props;

    const addedAuthority = await addAuthority({
      variables: {
        uuid: operatorUUID,
        department,
        role,
      },
    });
    const { data: { operator: { addDepartment: { error } } } } = addedAuthority;

    notify({
      level: error ? 'error' : 'success',
      title: error
        ? I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.TITLE')
        : I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.TITLE'),
      message: error
        ? I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.MESSAGE')
        : I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.MESSAGE'),
    });

    return addedAuthority;
  };

  render() {
    const {
      profile: { data: profile },
      allowedIpAddresses,
      forbiddenCountries,
      showNotes,
      showSalesStatus,
      showFTDAmount,
      authorities,
      auth: { uuid },
      departmentsRoles,
      userHierarchy: {
        loading,
        hierarchy,
      },
      operatorType,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const allowEditPermissions = manageDepartmentsPermission.check(currentPermissions) && uuid !== profile.uuid;
    const allowUpdateHierarchy = updateParentBranch.check(currentPermissions) && uuid !== profile.uuid;
    const initialValues = get(hierarchy, 'userHierarchyById.data') || {};
    const isPartner = operatorType === 'PARTNER';

    if (!isPartner && departmentsRoles) {
      delete departmentsRoles.AFFILIATE_PARTNER;
    }

    return (
      <div className="card-body">
        <div className="card">
          <div className="card-body">
            <PersonalForm
              isPartner={isPartner}
              initialValues={{
                firstName: profile.firstName,
                lastName: profile.lastName,
                country: profile.country,
                email: profile.email,
                phoneNumber: profile.phoneNumber,
                sip: profile.sip,
                allowedIpAddresses,
                forbiddenCountries,
                showNotes,
                showSalesStatus,
                showFTDAmount,
              }}
              disabled={this.readOnly}
              onSubmit={this.handleSubmit}
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
                onSubmit={this.handleAddAuthority}
                authorities={authorities.data ? authorities.data : []}
                departmentsRoles={departmentsRoles}
              />
            </If>
          </div>
        </div>
        <HierarchyProfileForm
          isPartner={isPartner}
          loading={loading}
          initialValues={initialValues}
          allowUpdateHierarchy={allowUpdateHierarchy}
        />
      </div>
    );
  }
}

export default withPermission(View);
