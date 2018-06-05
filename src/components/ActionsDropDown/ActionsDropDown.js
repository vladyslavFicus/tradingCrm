import React from 'react';
import PropTypes from 'prop-types';
import { DropdownItem } from 'reactstrap';
import DropDown from '../DropDown';

const ActionsDropDown = ({ items }) => {
  const visibleItems = items.filter(item => item.visible === undefined || item.visible);

  if (!visibleItems.length) {
    return false;
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

export default ActionsDropDown;
