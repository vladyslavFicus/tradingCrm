import React, { PureComponent } from 'react';
import compose from 'compose-function';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import HeaderDepartmentsMutation from './graphql/HeaderDepartmentsMutation';
import './HeaderDepartments.scss';

class HeaderDepartments extends PureComponent {
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
    } catch (e) {
      // Do nothing...
    }
  };

  render() {
    const { brand, auth } = this.props;
    const { isOpen } = this.state;

    const departments = brand?.departments || [];

    const currentDepartment = departments.find(({ department }) => auth.department === department);
    const departmentsLeft = departments.filter(({ department }) => auth.department !== department);

    if (!currentDepartment) return null;

    return (
      <Choose>
        <When condition={departmentsLeft.length === 0}>
          <div className="HeaderDepartments">
            <div className="HeaderDepartments-item HeaderDepartments-item--current">
              <div className="HeaderDepartments-item__title">
                {I18n.t(
                  `CONSTANTS.OPERATORS.DEPARTMENTS.${currentDepartment.department}`,
                  { defaultValue: currentDepartment.department },
                )}
              </div>
              <div className="HeaderDepartments-item__role">
                {I18n.t(
                  `CONSTANTS.OPERATORS.ROLES.${currentDepartment.role}`,
                  { defaultValue: currentDepartment.role },
                )}
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
                {I18n.t(
                  `CONSTANTS.OPERATORS.DEPARTMENTS.${currentDepartment.department}`,
                  { defaultValue: currentDepartment.department },
                )}
              </div>
              <div className="HeaderDepartments-item__role">
                {I18n.t(
                  `CONSTANTS.OPERATORS.ROLES.${currentDepartment.role}`,
                  { defaultValue: currentDepartment.role },
                )}
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
                  <img
                    src={`/img/departments/${department.department}.svg`}
                    onError={(e) => { e.target.src = '/img/image-placeholder.svg'; }}
                    className="HeaderDepartments-item__image"
                    alt={`${department.department} / ${department.role}`}
                  />
                  <div>
                    <div className="HeaderDepartments-item__title">
                      {I18n.t(
                        `CONSTANTS.OPERATORS.DEPARTMENTS.${department.department}`,
                        { defaultValue: department.department },
                      )}
                    </div>
                    <div className="HeaderDepartments-item__role">
                      {I18n.t(`CONSTANTS.OPERATORS.ROLES.${department.role}`, { defaultValue: department.role })}
                    </div>
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
