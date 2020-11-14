import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Subscription } from 'react-apollo';

const REQUEST = gql`
  subscription MainLayout__NotificationSubscription {
    onNotification {
      uuid
      targetUuid
      type
      subtype
      priority
      profileUuid
      operatorUuid
      details
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
