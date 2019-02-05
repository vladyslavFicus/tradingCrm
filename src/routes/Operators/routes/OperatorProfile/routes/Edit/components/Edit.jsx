import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get, omit } from 'lodash';
import PropTypes from 'constants/propTypes';
import { departmentsLabels, rolesLabels, departments } from 'constants/operators';
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
      isLoading: PropTypes.bool,
      receivedAt: PropTypes.any,
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
    allowedIpAddresses: PropTypes.arrayOf(PropTypes.string).isRequired,
    forbiddenCountries: PropTypes.arrayOf(PropTypes.string).isRequired,
    isForexOperatorCreated: PropTypes.bool.isRequired,
    fetchAuthority: PropTypes.func.isRequired,
    updateForexOperator: PropTypes.func.isRequired,
    createForexOperator: PropTypes.func.isRequired,
    deleteAuthority: PropTypes.func.isRequired,
    addAuthority: PropTypes.func.isRequired,
    fetchAuthoritiesOptions: PropTypes.func.isRequired,
    authorities: PropTypes.oneOfType([PropTypes.authorityEntity, PropTypes.object]),
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    auth: PropTypes.shape({
      uuid: PropTypes.string,
    }).isRequired,
  };

  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    authorities: [],
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

  handleRefetchHierarchy = () => this.props.userHierarchy.refetch({ fetchPolicy: 'network-only' });

  handleSubmit = (data) => {
    const {
      isForexOperatorCreated,
      updateProfile,
      match: { params: { id: operatorUUID } },
      updateForexOperator,
      createForexOperator,
    } = this.props;
    const reqBody = {
      permission: {
        allowedIpAddresses: data.allowedIpAddresses,
        forbiddenCountries: data.forbiddenCountries,
      },
      uuid: operatorUUID,
    };

    updateProfile(operatorUUID, omit(data, ['allowedIpAddresses', 'forbiddenCountries']));
    if (isForexOperatorCreated) {
      updateForexOperator(reqBody);
    } else {
      createForexOperator(reqBody);
    }
  }

  handleDeleteAuthority = async (department, role) => {
    const {
      match: { params: { id: operatorUUID } }, fetchAuthority, deleteAuthority, notify,
    } = this.props;
    const deleteAuthorityAction = await deleteAuthority(operatorUUID, department, role);

    if (deleteAuthorityAction.error) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.MESSAGE'),
      });

      return deleteAuthorityAction;
    }

    const fetchAuthorityAction = await fetchAuthority(operatorUUID);

    if (fetchAuthorityAction.error) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.GET_AUTHORITIES_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.GET_AUTHORITIES_ERROR.MESSAGE'),
      });

      return fetchAuthorityAction;
    }

    return fetchAuthorityAction;
  };

  handleAddAuthority = async (data) => {
    const {
      match: { params: { id: operatorUUID } }, fetchAuthority, addAuthority, notify,
    } = this.props;

    const addAuthorityAction = await addAuthority(operatorUUID, data);

    if (addAuthorityAction.error) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.MESSAGE'),
      });

      return addAuthorityAction;
    }

    const fetchAuthorityAction = await fetchAuthority(operatorUUID);

    if (fetchAuthorityAction.error) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.GET_OPERATORS_AUTHORITIES_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.GET_OPERATORS_AUTHORITIES_ERROR.MESSAGE'),
      });

      return fetchAuthorityAction;
    }

    return fetchAuthorityAction;
  };

  render() {
    const {
      profile: { data: profile, receivedAt: profileLoaded },
      allowedIpAddresses,
      forbiddenCountries,
      authorities: { data: authorities },
      auth: { uuid },
      departmentsRoles,
      userHierarchy: {
        loading,
        hierarchy,
      },
    } = this.props;

    const { permissions: currentPermissions } = this.context;
    const allowEditPermissions = manageDepartmentsPermission.check(currentPermissions) && uuid !== profile.uuid;
    const initialValues = get(hierarchy, 'userHierarchyById.data') || {};

    return (
      <div className="card-body">
        <div className="card">
          <div className="card-body">
            <If condition={profileLoaded}>
              <PersonalForm
                isPartner={!!authorities.find(authority => authority.department === departments.AFFILIATE_PARTNER)}
                initialValues={{
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  country: profile.country,
                  email: profile.email,
                  phoneNumber: profile.phoneNumber,
                  allowedIpAddresses,
                  forbiddenCountries,
                }}
                onSubmit={this.handleSubmit}
              />
            </If>
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
        <HierarchyProfileForm
          loading={loading}
          initialValues={initialValues}
        />
      </div>
    );
  }
}

export default View;
