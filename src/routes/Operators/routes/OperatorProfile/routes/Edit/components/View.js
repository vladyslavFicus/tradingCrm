import React, { Component } from 'react';
import Form from './Form';
import DepartmentsForm from './DepartmentsForm';
import PropTypes from '../../../../../../../constants/propTypes';

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
    departments: PropTypes.arrayOf(PropTypes.configDepartmentEntity),
    roles: PropTypes.arrayOf(PropTypes.configRoleEntity),
  };

  handleSubmit = data => this.props.updateProfile(this.props.params.id, data);

  handleFetchAuthority = () => {
    this.props.fetchAuthority(this.props.params.id);
  };

  handleDeleteAuthority = (department, role) => {
    this.props.deleteAuthority(this.props.params.id, department, role);
  };

  handleAddAuthority = (data) => {
    return this.props.addAuthority(this.props.params.id, data);
  };

  render() {
    const {
      profile: { data: profile, receivedAt: profileLoaded },
      authorities: { data: authorities },
      roles,
      departments,
    } = this.props;

    return (
      <div className="player__account__page_profile tab-content padding-vertical-20">
        <div className="tab-pane active" role="tabpanel">
          <div className="panel">
            <div className="panel-body row">
              <div className="col-md-12">
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
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-body row">
              <div className="col-md-12">
                <div className="row">
                  <h5 className="pull-left">Departments</h5>
                </div>
                <div className="row">
                  {
                    authorities.map((authority, key) => (
                      <div key={key} className="form-group col-md-12">
                        <div className="col-md-4 font-weight-700">
                          {authority.department} - {authority.role}
                          <i
                            onClick={() => this.handleDeleteAuthority(authority.department, authority.role)}
                            className="fa fa-trash color-danger float-right"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div className="col-md-12">
                  <DepartmentsForm
                    onFetch={this.handleFetchAuthority}
                    onSubmit={this.handleAddAuthority}
                    authorities={authorities}
                    departments={departments}
                    roles={roles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default View;
