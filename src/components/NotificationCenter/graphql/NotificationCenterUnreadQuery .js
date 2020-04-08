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

const NotificationCenterUnreadQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">{children}</Query>
);

NotificationCenterUnreadQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterUnreadQuery;
