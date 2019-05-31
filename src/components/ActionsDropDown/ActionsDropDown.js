import React from 'react';
import PropTypes from 'prop-types';
import { DropdownItem } from 'reactstrap';
import Permissions from 'utils/permissions';
import DropDown from '../DropDown';

const ActionsDropDown = ({ items }, { permissions: currentPermissions }) => {
  const visibleItems = items.filter((item) => {
    const isValidPermission = !(item.permissions instanceof Permissions) || item.permissions.check(currentPermissions);

    return (item.visible === undefined || item.visible) && isValidPermission;
  });

  if (!visibleItems.length) {
    return null;
  }

  return (
    <DropDown
      className="d-inline-block"
      toggleClassName="btn btn-sm btn-default-outline"
      withArrow
      rightPlacement
    >
      {visibleItems.map(item => (
        <DropdownItem
          id={item.id}
          key={item.label}
          onClick={item.onClick}
        >
          {item.label}
        </DropdownItem>
      ))}
    </DropDown>
  );
};

ActionsDropDown.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  })).isRequired,
};

ActionsDropDown.contextTypes = {
  permissions: PropTypes.array.isRequired,
};

export default ActionsDropDown;
