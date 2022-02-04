import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from 'apollo';

export const REQUEST = gql`
  query NotificationCenterUnreadQuery {
    notificationCenterUnread
  }
`;

const NotificationCenterUnreadQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

NotificationCenterUnreadQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterUnreadQuery;
