import React from 'react';
import classNames from 'classnames';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import I18n from 'i18n-js';
import useHeaderDepartments from 'components/Header/hooks/useHeaderDepartments';
import './HeaderDepartments.scss';

const HeaderDepartments = () => {
  const { isOpen, toggleDropdown, changeDepartment, currentDepartment, departmentsLeft } = useHeaderDepartments();

  if (!currentDepartment) return null;

  return (
    <Choose>
      <When condition={!departmentsLeft.length}>
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
      </When>

      <Otherwise>
        <Dropdown className="HeaderDepartments" isOpen={isOpen} toggle={toggleDropdown}>
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
                onClick={changeDepartment(department)}
              >
                <img
                  src={`/img/departments/${department.department}.svg`}
                  onError={(e) => {
                    e.currentTarget.src = '/img/image-placeholder.svg';
                  }}
                  className="HeaderDepartments-item__image"
                  alt={`${department.department} / ${department.role}`}
                />

                <div className="HeaderDepartments__list-item">
                  <span className="HeaderDepartments-item__title">
                    {I18n.t(
                      `CONSTANTS.OPERATORS.DEPARTMENTS.${department.department}`,
                      { defaultValue: department.department },
                    )}
                  </span>

                  <span className="HeaderDepartments-item__role">
                    {I18n.t(`CONSTANTS.OPERATORS.ROLES.${department.role}`, { defaultValue: department.role })}
                  </span>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </Otherwise>
    </Choose>
  );
};

export default React.memo(HeaderDepartments);
