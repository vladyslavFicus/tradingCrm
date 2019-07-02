import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { departmentsLabels, rolesLabels, operatorTypes } from 'constants/operators';
import renderLabel from 'utils/renderLabel';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import HierarchyProfileForm from './HierarchyProfileForm';
import PersonalForm from './PersonalForm';
import DepartmentsForm from './DepartmentsForm';

const manageDepartmentsPermission = new Permissions([
  permissions.OPERATORS.ADD_AUTHORITY,
  permissions.OPERATORS.DELETE_AUTHORITY,
]);

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
    fetchAuthoritiesOptions: PropTypes.func.isRequired,
    authorities: PropTypes.oneOfType([PropTypes.authorityEntity, PropTypes.object]),
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    auth: PropTypes.shape({
      uuid: PropTypes.string,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };

  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    operatorType: operatorTypes.OPERATOR,
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

  componentDidMount() {
    this.props.fetchAuthoritiesOptions();
  }

  get readOnly() {
    const { permissions: currentPermission } = this.context;
    const permittedRights = [permissions.OPERATORS.UPDATE_PROFILE];

    return !(new Permissions(permittedRights).check(currentPermission));
  }

  handleRefetchHierarchy = () => this.props.userHierarchy.refetch();

  handleSubmit = (data) => {
    const {
      updateProfile,
      match: { params: { id: operatorUUID } },
    } = this.props;

    updateProfile({
      variables: {
        uuid: operatorUUID,
        ...data,
      },
    });
  }

  handleDeleteAuthority = async (department, role) => {
    const {
      match: { params: { id: operatorUUID } }, deleteAuthority, notify,
    } = this.props;

    const deletedAuthority = await deleteAuthority({
      variables: {
        uuid: operatorUUID,
        department,
        role,
      },
    });
    if (get(deletedAuthority, 'data.operator.removeDepartment.error', null)) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.MESSAGE'),
      });
    }
    return deletedAuthority;
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
    if (get(addedAuthority, 'data.operator.addDepartment.error', null)) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.MESSAGE'),
      });
    }
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
      authorities: { data: authorities },
      auth: { uuid },
      departmentsRoles,
      userHierarchy: {
        loading,
        hierarchy,
      },
      operatorType,
      locale,
    } = this.props;

    const { permissions: currentPermissions } = this.context;
    const allowEditPermissions = manageDepartmentsPermission.check(currentPermissions) && uuid !== profile.uuid;
    const initialValues = get(hierarchy, 'userHierarchyById.data') || {};
    const isPartner = operatorType === operatorTypes.PARTNER;

    if (!isPartner) delete departmentsRoles.AFFILIATE_PARTNER;

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
                allowedIpAddresses,
                forbiddenCountries,
                showNotes,
                showSalesStatus,
                showFTDAmount,
              }}
              disabled={this.readOnly}
              onSubmit={this.handleSubmit}
              locale={locale}
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
                    {renderLabel(authority.department, departmentsLabels)}
                    {' - '}
                    {renderLabel(authority.role, rolesLabels)}
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
            <If condition={allowEditPermissions}>
              <DepartmentsForm
                onSubmit={this.handleAddAuthority}
                authorities={authorities}
                departmentsRoles={departmentsRoles}
              />
            </If>
          </div>
        </div>
        <If condition={allowEditPermissions}>
          <HierarchyProfileForm
            isPartner={isPartner}
            loading={loading}
            initialValues={initialValues}
          />
        </If>
      </div>
    );
  }
}

export default View;
