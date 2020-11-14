import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import NotificationItem from './components/NotificationItem';
import NotificationSubscription from './graphql/NotificationSubscription';
import 'react-toastify/dist/ReactToastify.css';
import './Notifications.scss';

class Notifications extends PureComponent {
  static propTypes = {
    notificationSubscription: PropTypes.subscription({
      balance: PropTypes.number,
    }).isRequired,
  };

  componentDidUpdate() {
    const { notificationSubscription } = this.props;

    if (!notificationSubscription.error && !notificationSubscription.loading) {
      toast(<NotificationItem {...notificationSubscription.data.onNotification} />);
    }
  }

  render() {
    return (
      <ToastContainer
        newestOnTop
        hideProgressBar
        limit={3}
        className="Notifications__toast"
        position="bottom-right"
        transition={Slide}
      />
    );
  }
}

export default compose(
  withRequests({
    notificationSubscription: NotificationSubscription,
  }),
)(Notifications);
