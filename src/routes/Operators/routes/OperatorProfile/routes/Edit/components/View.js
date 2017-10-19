import React, { Component } from 'react';
import Form from './Form';
import DepartmentsForm from './DepartmentsForm';
import PropTypes from '../../../../../../../constants/propTypes';
import { departmentsLabels, rolesLabels } from '../../../../../../../constants/operators';
import { renderLabel } from '../../../../../utils';
import PermissionContent from '../../../../../../../components/PermissionContent';
import Permissions from '../../../../../../../utils/permissions';
import permission from '../../../../../../../config/permissions';
import Card, { Content } from '../../../../../../../components/Card';

const manageDepartmentsPermissions = new Permissions([
  permission.OPERATORS.ADD_AUTHORITY, permission.OPERATORS.DELETE_AUTHORITY,
]);

class View extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    profile: PropTypes.shape({
      data: PropTypes.operatorProfile,
      error: PropTypes.any,
      isLoading: PropTypes.bool,
      receivedAt: PropTypes.any,
    }),
    fetchAuthority: PropTypes.func.isRequired,
    deleteAuthority: PropTypes.func.isRequired,
    addAuthority: PropTypes.func.isRequired,
    authorities: PropTypes.oneOfType([PropTypes.authorityEntity, PropTypes.object]),
    departments: PropTypes.arrayOf(PropTypes.dropDownOption),
    roles: PropTypes.arrayOf(PropTypes.dropDownOption),
  };

  handleSubmit = data => this.props.updateProfile(this.props.params.id, data);

  handleFetchAuthority = () => {
    this.props.fetchAuthority(this.props.params.id);
  };

  handleDeleteAuthority = (department, role) => {
    this.props.deleteAuthority(this.props.params.id, department, role);
  };

  handleAddAuthority = data => (
    this.props.addAuthority(this.props.params.id, data)
  );

  render() {
    const {
      profile: { data: profile, receivedAt: profileLoaded },
      authorities: { data: authorities },
      roles,
      departments,
    } = this.props;

    return (
      <Content>
        <Card>
          <Content>
            {
              !!profileLoaded &&
              <Form
                initialValues={{
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  country: profile.country,
                  email: profile.email,
                  phoneNumber: profile.phoneNumber,
                }}
                onSubmit={this.handleSubmit}
              />
            }
          </Content>
        </Card>
        <PermissionContent permissions={manageDepartmentsPermissions}>
          <Card>
            <Content>
              <div className="personal-form-heading margin-bottom-20">Departments</div>
              {
                authorities.map((authority, key) => (
                  <div key={key} className="margin-bottom-20">
                    <strong>
                      {renderLabel(authority.department, departmentsLabels)}
                      {' - '}
                      { renderLabel(authority.role, rolesLabels) }
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
                onFetch={this.handleFetchAuthority}
                onSubmit={this.handleAddAuthority}
                authorities={authorities}
                departments={departments}
                roles={roles}
              />
            </Content>
          </Card>
        </PermissionContent>
      </Content>
    );
  }
}
export default View;
