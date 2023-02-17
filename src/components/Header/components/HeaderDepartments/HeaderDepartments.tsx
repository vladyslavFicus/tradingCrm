import React, { useState } from 'react';
import compose from 'compose-function';
import classNames from 'classnames';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import I18n from 'i18n-js';
import { withStorage } from 'providers/StorageProvider';
import { Authority, BrandToAuthorities } from '__generated__/types';
import { useChooseDepartmentMutation } from './graphql/__generated__/ChooseDepartmentsMutation';
import './HeaderDepartments.scss';

type Props = {
  storage: Storage,
  brand: BrandToAuthorities,
  auth: Authority,
}

const HeaderDepartments = (props: Props) => {
  const { storage, brand: { authorities, id }, auth } = props;
  const [isOpen, setOpen] = useState(false);

  const [chooseDepartment] = useChooseDepartmentMutation();

  const toggleDropdown = () => setOpen(value => !value);

  const changeDepartment = ({ department, role }: Authority) => async () => {
    try {
      const { data } = await chooseDepartment({
        variables: {
          brand: id,
          department,
          role,
        },
      });

      const { token, uuid } = data?.auth?.chooseDepartment || {};

      storage.set('token', token);
      storage.set('auth', { department, role, uuid });
    } catch (e) {
      // Do nothing...
    }
  };

  const currentDepartment = authorities.find(({ department }) => auth.department === department);
  const departmentsLeft = authorities.filter(({ department }) => auth.department !== department);

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

export default compose(
  React.memo,
  withStorage(['auth', 'brand']),
)(HeaderDepartments);
