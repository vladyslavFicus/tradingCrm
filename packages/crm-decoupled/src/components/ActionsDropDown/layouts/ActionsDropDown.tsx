import React from 'react';
import { DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import DropDown from 'components/DropDown';
import { ActionItem } from 'components/ActionsDropDown/types';
import useActionsDropDown from 'components/ActionsDropDown/hooks/useActionsDropDown';
import './ActionsDropDown.scss';

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

  const {
    visibleItems,
  } = useActionsDropDown(items);

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
