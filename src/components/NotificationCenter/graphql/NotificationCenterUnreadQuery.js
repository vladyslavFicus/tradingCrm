import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query NotificationCenterUnreadQuery {
    notificationCenterUnread {
      data
    }
  }
`;

const NotificationCenterUnreadQuery = ({ children, pollActive }) => (
  <Query
    query={REQUEST}
    pollInterval={pollActive ? 10000 : 0}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

NotificationCenterUnreadQuery.propTypes = {
  children: PropTypes.func.isRequired,
  pollActive: PropTypes.bool.isRequired,
};

export default NotificationCenterUnreadQuery;
