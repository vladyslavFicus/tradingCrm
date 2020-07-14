import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query NotificationCenterUnreadQuery {
    notificationCenterUnread
  }
`;

const NotificationCenterUnreadQuery = ({ children }) => (
  <Query
    query={REQUEST}
    pollInterval={10000}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

NotificationCenterUnreadQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterUnreadQuery;
