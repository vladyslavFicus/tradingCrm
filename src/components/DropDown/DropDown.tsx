import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import './DropDown.scss';

type Props = {
  className?: string,
  rightPlacement?: boolean,
  children: React.ReactNode,
  toggleClassName?: string,
  withArrow?: boolean,
  label?: string | React.ReactElement,
  toggleId?: string,
}

const DropDown = (props: Props) => {
  const {
    className,
    rightPlacement,
    children,
    toggleClassName,
    withArrow,
    label,
    toggleId,
  } = props;
  const [open, setOpen] = useState<boolean>(false);

  const toggleState = () => {
    setOpen(!open);
  };

  return (
    <Dropdown className={className} isOpen={open} toggle={toggleState}>
      <DropdownToggle
        className={toggleClassName}
        tag="button"
        id={toggleId}
      >
        <If condition={!!label}>
          {label}
        </If>

        <If condition={!!withArrow}>
          <i className="fa fa-caret-down" />
        </If>
      </DropdownToggle>

      <DropdownMenu
        className="drop-down"
        end={rightPlacement}
      >
        {children}
      </DropdownMenu>
    </Dropdown>
  );
};

export default React.memo(DropDown);
