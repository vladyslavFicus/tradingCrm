import React, { PureComponent } from 'react';
import { Popover } from 'reactstrap';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import NotificationCenterContent from './components/NotificationCenterContent';
import NotificationCenterTrigger from './components/NotificationCenterTrigger';
import './NotificationCenter.scss';

class NotificationCenter extends PureComponent {
  state = {
    isOpen: false,
    enableToggle: true,
  };

  toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

  onCloseModal = () => {
    this.setState(({ enableToggle: false }));

    /**
     * this trick needs to prevent popover closing after closing of modal opened in popover
     */
    return () => {
      setTimeout(() => {
        this.setState(({ enableToggle: true }));
      }, 500);
    };
  };

  render() {
    const { isOpen, enableToggle } = this.state;
    const id = 'NotificationCenterTrigger';

    return (
      <PermissionContent permissions={permissions.NOTIFICATION_CENTER.GET_UNREAD_COUNT}>
        <NotificationCenterTrigger
          id={id}
          onClick={this.toggle}
        />
        <Popover
          target={id}
          isOpen={isOpen}
          toggle={enableToggle ? this.toggle : () => {}}
          placement="bottom"
          className="NotificationCenter__popover"
          innerClassName="NotificationCenter__popover-inner"
          trigger="legacy"
        >
          <NotificationCenterContent onCloseModal={this.onCloseModal} />
        </Popover>
      </PermissionContent>
    );
  }
}

export default NotificationCenter;
