import React, { PureComponent } from 'react';
import { Popover } from 'reactstrap';
import PropTypes from 'constants/propTypes';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import NotificationCenterContent from './components/NotificationCenterContent';
import NotificationCenterTrigger from './components/NotificationCenterTrigger';
import './NotificationCenter.scss';

const unreadNotificationsPermission = new Permissions(permissions.NOTIFICATION_CENTER.GET_UNREAD_COUNT);

class NotificationCenter extends PureComponent {
  static propTypes = {
    permission: PropTypes.permission.isRequired,
  };

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
    const { permission: { permissions: currentPermissions } } = this.props;
    const { isOpen, enableToggle } = this.state;
    const id = 'NotificationCenterTrigger';

    return (
      <If condition={unreadNotificationsPermission.check(currentPermissions)}>
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
      </If>
    );
  }
}

export default withPermission(NotificationCenter);
