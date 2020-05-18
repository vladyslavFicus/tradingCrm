import React, { Component } from 'react';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import jwtDecode from 'jwt-decode';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import setBrandIdByUserToken from 'utils/setBrandIdByUserToken';
import HeaderDepartmentsMutation from './graphql/HeaderDepartmentsMutation';
import './HeaderDepartments.scss';

class HeaderDepartments extends Component {
  static propTypes = {
    departmentsByBrand: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    departments: PropTypes.arrayOf(PropTypes.department).isRequired,
    chooseDepartmentMutation: PropTypes.func.isRequired,
    storage: PropTypes.storage.isRequired,
    token: PropTypes.string.isRequired,
    auth: PropTypes.auth.isRequired,
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
      storage,
      departmentsByBrand,
      token: originalToken,
      chooseDepartmentMutation,
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
    } = await chooseDepartmentMutation({
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
          <div className="HeaderDepartments">
            <div className="HeaderDepartments-item HeaderDepartments-item--current">
              <div className="HeaderDepartments-item__title">
                {I18n.t(currentDepartment.name || `CONSTANTS.OPERATORS.DEPARTMENTS.${currentDepartment.id}`)}
              </div>
              <div className="HeaderDepartments-item__role">
                {I18n.t(currentDepartment.role)}
              </div>
            </div>
          </div>
        </When>
        <Otherwise>
          <Dropdown className="HeaderDepartments" isOpen={isOpen} toggle={this.handleToggleState}>
            <DropdownToggle
              className={
                classNames(
                  'HeaderDepartments-item HeaderDepartments-item--current HeaderDepartments-item--with-arrow',
                  { 'HeaderDepartments-item--is-open': isOpen },
                )}
              tag="div"
            >
              <div className="HeaderDepartments-item__title">
                {I18n.t(currentDepartment.name)}
              </div>
              <div className="HeaderDepartments-item__role">
                {I18n.t(currentDepartment.role)}
              </div>
              <i className="HeaderDepartments-item__caret fa fa-angle-down" />
            </DropdownToggle>
            <DropdownMenu className="HeaderDepartments__list">
              {departmentsLeft.map(department => (
                <DropdownItem
                  key={department.id}
                  className="HeaderDepartments-item"
                  onClick={this.changeDepartment(department.id)}
                >
                  <div className="HeaderDepartments-item__title">
                    {I18n.t(department.name)}
                  </div>
                  <div className="HeaderDepartments-item__role">
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
  withRequests({
    chooseDepartmentMutation: HeaderDepartmentsMutation,
  }),
)(HeaderDepartments);
