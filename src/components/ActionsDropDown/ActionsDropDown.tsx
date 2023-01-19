import React from 'react';
import { DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { usePermission } from 'providers/PermissionsProvider';
import DropDown from 'components/DropDown';
import './ActionsDropDown.scss';

type ActionItem = {
  label: string,
  onClick: () => void,
  permission?: string,
};

type Props = {
  items: Array<ActionItem>,
  className?: string,
  classNameMenu?: string,
};

const ActionsDropDown = (props: Props) => {
  const {
    items,
    className,
    classNameMenu,
  } = props;

  const permission = usePermission();

  const visibleItems = items.filter(item => !item.permission || permission.allows(item.permission));

  return (
    <If condition={visibleItems.length > 0}>
      <DropDown
        className={classNames('ActionDropDown', className)}
        classNameMenu={classNameMenu}
        toggleClassName="ActionDropDown__toggle"
        withArrow
        rightPlacement
      >
        {visibleItems.map((item, index) => (
          <DropdownItem
            id={`dropdown-item-${index}`}
            key={item.label}
            onClick={item.onClick}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropDown>
    </If>
  );
};

export default React.memo(ActionsDropDown);
