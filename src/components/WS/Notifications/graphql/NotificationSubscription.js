import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Subscription } from 'react-apollo';

const REQUEST = gql`
  subscription MainLayout__NotificationSubscription {
    onNotification {
      notification {
        uuid
        targetUuid
        type
        subtype
        priority
        profileUuid
        operatorUuid
        details
      }
      configuration {
        popUpDelayMs
      }
      totalNotificationsCount
    }
  }
`;

const NotificationSubscription = ({ children }) => (
  <Subscription subscription={REQUEST}>
    {children}
  </Subscription>
);

NotificationSubscription.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationSubscription;
