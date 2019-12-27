import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import classNames from 'classnames';
import jwtDecode from 'jwt-decode';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import I18n from 'i18n-js';
import { chooseDepartmentMutation } from 'graphql/mutations/authorization';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import setBrandIdByUserToken from 'utils/setBrandIdByUserToken';
import './header-departments.scss';

class HeaderDepartments extends Component {
  static propTypes = {
    departments: PropTypes.arrayOf(PropTypes.department.isRequired).isRequired,
    auth: PropTypes.auth.isRequired,
    token: PropTypes.string.isRequired,
  };

  state = {
    isOpen: false,
  };

  handleToggleState = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  changeDepartment = department => async () => {
    const {
      auth,
      token: originalToken,
      storage,
      departmentsByBrand,
      chooseDepartment,
    } = this.props;

    const { brandId } = jwtDecode(originalToken);

    const {
      data: {
        authorization: {
          chooseDepartment: {
            data: {
              token,
              uuid,
            },
            error,
          },
        },
      },
    } = await chooseDepartment({
      variables: {
        brandId,
        uuid: auth.uuid,
        department,
      },
    });

    if (!error) {
      storage.set('token', token);
      storage.set('auth', {
        department,
        role: departmentsByBrand[brandId][department],
        uuid,
      });

      // This function need to refresh window.app object to get new data from token
      setBrandIdByUserToken();
    }
  };

  render() {
    const { departments, auth } = this.props;
    const { isOpen } = this.state;

    const currentDepartment = departments.find(department => auth.department === department.id);
    const departmentsLeft = departments.filter(department => auth.department !== department.id);

    return (
      <Choose>
        <When condition={departmentsLeft.length === 0}>
          <div className="header-departments">
            <div className="header-department header-department--current">
              <div className="header-department__title">
                {I18n.t(currentDepartment.name)}
              </div>
              <div className="header-department__role">
                {I18n.t(currentDepartment.role)}
              </div>
            </div>
          </div>
        </When>
        <Otherwise>
          <Dropdown className="header-departments" isOpen={isOpen} toggle={this.handleToggleState}>
            <DropdownToggle
              className={
                classNames(
                  'header-department header-department--current header-department--with-arrow',
                  { 'is-open': isOpen },
                )}
              tag="div"
            >
              <div className="header-department__title">
                {I18n.t(currentDepartment.name)}
              </div>
              <div className="header-department__role">
                {I18n.t(currentDepartment.role)}
              </div>
              <i className="header-department__caret fa fa-angle-down" />
            </DropdownToggle>
            <DropdownMenu className="header-departments__list">
              {departmentsLeft.map(department => (
                <DropdownItem
                  key={department.id}
                  className="header-department"
                  onClick={this.changeDepartment(department.id)}
                >
                  <div className="header-department__title">
                    {I18n.t(department.name)}
                  </div>
                  <div className="header-department__role">
                    {I18n.t(department.role)}
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Otherwise>
      </Choose>
    );
  }
}

export default compose(
  withStorage(['auth', 'departmentsByBrand', 'departments', 'token']),
  graphql(chooseDepartmentMutation, { name: 'chooseDepartment' }),
)(HeaderDepartments);
