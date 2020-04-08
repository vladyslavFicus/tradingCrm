import React, { Fragment, PureComponent } from 'react';
import { Popover } from 'reactstrap';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import NotificationCenterUnreadQuery from './graphql/NotificationCenterUnreadQuery ';
import NotificationCenterContent from './components/NotificationCenterContent';
import NotificationCenterTrigger from './components/NotificationCenterTrigger';
import './NotificationCenter.scss';

const UNREAD_AMOUNT_POLL_TIMEOUT = 10000;

class NotificationCenter extends PureComponent {
  static propTypes = {
    notificationCenterUnread: PropTypes.query({
      notificationCenterUnread: PropTypes.shape({
        data: PropTypes.number,
      }),
    }).isRequired,
  };

  static getDerivedStateFromProps({ notificationCenterUnread }) {
    const unreadAmount = get(
      notificationCenterUnread,
      'data.notificationCenterUnread.data',
    );

    if (typeof unreadAmount === 'number') {
      return { unreadAmount };
    }

    return null;
  }

  state = {
    isOpen: false,
    unreadAmount: 0,
    enableToggle: true,
  };

  componentDidMount() {
    this.props.notificationCenterUnread.startPolling(UNREAD_AMOUNT_POLL_TIMEOUT);
  }

  componentWillUnmount() {
    this.props.notificationCenterUnread.stopPolling();
  }

  toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

  onCloseModal = () => {
    this.setState(({ enableToggle: false }));

    return () => {
      setTimeout(() => {
        this.setState(({ enableToggle: true }));
      }, 200);
    };
  };

  render() {
    const { unreadAmount, isOpen, enableToggle } = this.state;
    const id = 'NotificationCenterTrigger';

    return (
      <Fragment>
        <NotificationCenterTrigger
          id={id}
          onClick={this.toggle}
          counter={unreadAmount}
        />
        <Popover
          target={id}
          isOpen={isOpen}
          toggle={enableToggle ? this.toggle : () => {}}
          placement="bottom"
          className="NotificationCenter__popover"
          innerClassName="NotificationCenter__popover-inner"
        >
          <NotificationCenterContent onCloseModal={this.onCloseModal} />
        </Popover>
      </Fragment>
    );
  }
}

export default withRequests({
  notificationCenterUnread: NotificationCenterUnreadQuery,
})(NotificationCenter);
