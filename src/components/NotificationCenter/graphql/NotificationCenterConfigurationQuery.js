import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query NotificationCenterConfigurationQuery {
    notificationCenterConfiguration {
      showNotificationsPopUp
    }
  }
`;

const NotificationCenterConfigurationQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

NotificationCenterConfigurationQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterConfigurationQuery;
