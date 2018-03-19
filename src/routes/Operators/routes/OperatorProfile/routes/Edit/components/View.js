import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PersonalForm from './PersonalForm';
import DepartmentsForm from './DepartmentsForm';
import PropTypes from '../../../../../../../constants/propTypes';
import { departmentsLabels, rolesLabels } from '../../../../../../../constants/operators';
import renderLabel from '../../../../../../../utils/renderLabel';
import PermissionContent from '../../../../../../../components/PermissionContent';
import permissions from '../../../../../../../config/permissions';
import Card, { Content } from '../../../../../../../components/Card';

const manageDepartmentsPermissions = [
  permissions.OPERATORS.ADD_AUTHORITY,
  permissions.OPERATORS.DELETE_AUTHORITY,
];

class View extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    profile: PropTypes.shape({
      data: PropTypes.operatorProfile,
      error: PropTypes.any,
      isLoading: PropTypes.bool,
      receivedAt: PropTypes.any,
    }).isRequired,
    fetchAuthority: PropTypes.func.isRequired,
    deleteAuthority: PropTypes.func.isRequired,
    addAuthority: PropTypes.func.isRequired,
    fetchAuthoritiesOptions: PropTypes.func.isRequired,
    authorities: PropTypes.oneOfType([PropTypes.authorityEntity, PropTypes.object]),
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  };
  static defaultProps = {
    authorities: [],
  };

  componentDidMount() {
    this.props.fetchAuthoritiesOptions();
  }

  handleSubmit = data => this.props.updateProfile(this.props.params.id, data);

  handleDeleteAuthority = async (department, role) => {
    const { params: { id: operatorUUID }, fetchAuthority, deleteAuthority, notify } = this.props;
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
    const { params: { id: operatorUUID }, fetchAuthority, addAuthority, notify } = this.props;

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
      authorities: { data: authorities },
      departmentsRoles,
    } = this.props;

    return (
      <Content>
        <Card>
          <Content>
            <If condition={profileLoaded}>
              <PersonalForm
                initialValues={{
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  country: profile.country,
                  email: profile.email,
                  phoneNumber: profile.phoneNumber,
                }}
                onSubmit={this.handleSubmit}
              />
            </If>
          </Content>
        </Card>
        <PermissionContent permissions={manageDepartmentsPermissions}>
          <Card>
            <Content>
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
                    <strong className="margin-left-20">
                      <i
                        onClick={() => this.handleDeleteAuthority(authority.department, authority.role)}
                        className="fa fa-trash cursor-pointer color-danger"
                      />
                    </strong>
                  </div>
                ))
              }
              <DepartmentsForm
                onSubmit={this.handleAddAuthority}
                authorities={authorities}
                departmentsRoles={departmentsRoles}
              />
            </Content>
          </Card>
        </PermissionContent>
      </Content>
    );
  }
}

export default View;
