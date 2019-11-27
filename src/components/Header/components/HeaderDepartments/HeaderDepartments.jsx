import React, { Component } from 'react';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import I18n from 'i18n-js';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import setBrandIdByUserToken from 'utils/setBrandIdByUserToken';
import './header-departments.scss';

class HeaderDepartments extends Component {
  static propTypes = {
    departments: PropTypes.arrayOf(PropTypes.department.isRequired).isRequired,
    auth: PropTypes.auth.isRequired,
    brand: PropTypes.brand.isRequired,
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
      brand,
      storage,
      departmentsByBrand,
      chooseDepartmentMutation,
    } = this.props;

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
        brandId: brand.brand,
        uuid: auth.uuid,
        department,
      },
    });

    if (!error) {
      storage.set({
        token,
        auth: {
          department,
          role: departmentsByBrand[brand.brand][department],
          uuid,
        },
      });

      // This function need to refresh window.app object to get new data from token
      setBrandIdByUserToken();
    }
  }

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

export default withStorage(['auth', 'brand', 'departmentsByBrand', 'departments'])(HeaderDepartments);
