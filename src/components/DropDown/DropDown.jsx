import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import './DropDown.scss';

class DropDown extends Component {
  static propTypes = {
    className: PropTypes.string,
    rightPlacement: PropTypes.bool,
    children: PropTypes.node.isRequired,
    toggleClassName: PropTypes.string,
    withArrow: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    toggleId: PropTypes.string,
  };

  static defaultProps = {
    className: null,
    rightPlacement: false,
    toggleClassName: null,
    withArrow: false,
    label: null,
    toggleId: null,
  };

  state = {
    isOpen: false,
  };

  toggleState = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  render() {
    const {
      className,
      rightPlacement,
      children,
      toggleClassName,
      withArrow,
      label,
      toggleId,
    } = this.props;
    const { isOpen } = this.state;

    return (
      <Dropdown className={className} isOpen={isOpen} toggle={this.toggleState}>
        <DropdownToggle
          className={toggleClassName}
          tag="button"
          id={toggleId}
        >
          <If condition={label}>
            {label}
          </If>
          <If condition={withArrow}>
            <i className="fa fa-caret-down" />
          </If>
        </DropdownToggle>
        <DropdownMenu className="drop-down" right={rightPlacement}>
          {children}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default DropDown;
