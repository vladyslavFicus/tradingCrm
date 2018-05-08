import React from 'react';
import PropTypes from 'prop-types';

export default function withNotifications(WrappedComponent) {
  const NotificationWrapper = (props, context) => <WrappedComponent {...props} notify={context.addNotification} />;
  NotificationWrapper.contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  return NotificationWrapper;
}
