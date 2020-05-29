import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query NotificationCenterQuery(
      $args: NotificationCenterInputType
    ) {
    notificationCenter(
      args: $args
    ) {
      data {
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
          details {
            amount
            currency
            login
            platformType
            callbackTime
          }
        }
        last
        size
        number
        totalElements
      }
      error {
        error
      }
    }
  }
`;

const NotificationCenterQuery = ({ children }) => (
  <Query
    query={REQUEST}
    variables={{ args: { page: { from: 0, size: 10 } } }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

NotificationCenterQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterQuery;
