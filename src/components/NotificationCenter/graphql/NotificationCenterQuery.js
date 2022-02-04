import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query NotificationCenterQuery($args: NotificationCenterSearch__Input) {
    notificationCenter(args: $args) @connection(key: "NotificationCenterPopup") {
      content {
        read
        uuid
        priority
        client {
          uuid
          firstName
          lastName
          languageCode
        }
        createdAt
        type
        subtype
        details
      }
      last
      size
      number
      totalElements
    }
  }
`;

const NotificationCenterQuery = ({ children }) => (
  <Query
    query={REQUEST}
    variables={{ args: { page: { from: 0, size: 10 } } }}
    fetchPolicy="cache-and-network"
    context={{ batch: false }}
  >
    {children}
  </Query>
);

NotificationCenterQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterQuery;
