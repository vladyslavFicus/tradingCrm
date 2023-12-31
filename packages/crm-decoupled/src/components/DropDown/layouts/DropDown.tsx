import React from 'react';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import useDropDown from 'components/DropDown/hooks/useDropDown';
import './DropDown.scss';

type Props = {
  className?: string,
  classNameMenu?: string,
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
    classNameMenu,
    rightPlacement,
    children,
    toggleClassName,
    withArrow,
    label,
    toggleId,
  } = props;

  const { open, toggleState } = useDropDown();

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
        className={classNames('drop-down', classNameMenu)}
        end={rightPlacement}
        container="body"
      >
        {children}
      </DropdownMenu>
    </Dropdown>
  );
};

export default React.memo(DropDown);
