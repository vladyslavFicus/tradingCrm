import React, { Fragment, PureComponent } from 'react';
import { Popover } from 'reactstrap';
import StorageProvider from 'providers/StorageProvider';
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
      }, 200);
    };
  };

  render() {
    const { isOpen, enableToggle } = this.state;
    const id = 'NotificationCenterTrigger';

    return (
      <Fragment>
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
        >
          <StorageProvider>
            <NotificationCenterContent onCloseModal={this.onCloseModal} />
          </StorageProvider>
        </Popover>
      </Fragment>
    );
  }
}

export default NotificationCenter;
