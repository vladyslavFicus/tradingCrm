import React, { Component } from 'react';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import setBrandIdByUserToken from 'utils/setBrandIdByUserToken';
import formatLabel from 'utils/formatLabel';
import HeaderDepartmentsMutation from './graphql/HeaderDepartmentsMutation';
import './HeaderDepartments.scss';

class HeaderDepartments extends Component {
  static propTypes = {
    chooseDepartmentMutation: PropTypes.func.isRequired,
    storage: PropTypes.storage.isRequired,
    brand: PropTypes.brand.isRequired,
    auth: PropTypes.auth.isRequired,
  };

  state = {
    isOpen: false,
  };

  handleToggleState = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  changeDepartment = ({ department, role }) => async () => {
    const {
      storage,
      brand: { id: brandId },
      chooseDepartmentMutation,
    } = this.props;

    try {
      const { data: { auth: { chooseDepartment: { token, uuid } } } } = await chooseDepartmentMutation({
        variables: {
          brand: brandId,
          department,
          role,
        },
      });

      storage.set('token', token);
      storage.set('auth', { department, role, uuid });

      // This function need to refresh window.app object to get new data from token
      setBrandIdByUserToken();
    } catch (e) {
      // Do nothing...
    }
  };

  render() {
    const { brand: { departments }, auth } = this.props;
    const { isOpen } = this.state;

    const currentDepartment = departments.find(({ department }) => auth.department === department);
    const departmentsLeft = departments.filter(({ department }) => auth.department !== department);

    return (
      <Choose>
        <When condition={departmentsLeft.length === 0}>
          <div className="HeaderDepartments">
            <div className="HeaderDepartments-item HeaderDepartments-item--current">
              <div className="HeaderDepartments-item__title">
                {I18n.t(currentDepartment.name || `CONSTANTS.OPERATORS.DEPARTMENTS.${currentDepartment.department}`)}
              </div>
              <div className="HeaderDepartments-item__role">
                {formatLabel(currentDepartment.role)}
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
                {formatLabel(currentDepartment.role)}
              </div>
              <i className="HeaderDepartments-item__caret fa fa-angle-down" />
            </DropdownToggle>
            <DropdownMenu className="HeaderDepartments__list">
              {departmentsLeft.map(department => (
                <DropdownItem
                  key={department.id}
                  className="HeaderDepartments-item"
                  onClick={this.changeDepartment(department)}
                >
                  <div className="HeaderDepartments-item__title">
                    {I18n.t(department.name)}
                  </div>
                  <div className="HeaderDepartments-item__role">
                    {formatLabel(department.role)}
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
  withStorage(['auth', 'brand']),
  withRequests({
    chooseDepartmentMutation: HeaderDepartmentsMutation,
  }),
)(HeaderDepartments);
