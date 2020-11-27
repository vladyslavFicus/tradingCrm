import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation NotificationCenterConfigurationUpdate(
    $showNotificationsPopUp: Boolean
  ) {
    notificationCenter {
      updateConfiguration(
        showNotificationsPopUp: $showNotificationsPopUp
      )
    }
  }
`;

const NotificationCenterConfigurationUpdate = ({ children }) => (
  <Mutation mutation={REQUEST}>{children}</Mutation>
);

NotificationCenterConfigurationUpdate.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterConfigurationUpdate;
