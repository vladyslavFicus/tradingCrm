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

/**
 * The React.memo with second argument is used here to prevent
 * query refetching with initial arguments triggered by parent
 * query request. This behavior is exposed when there was already
 * done the refetch by child component with another params.
 *
 * In simple words this is the same as:
 * ShouldComponentUpdate = () => false;
 */
const NotificationCenterQuery = React.memo(({ children }) => (
  <Query
    query={REQUEST}
    variables={{ args: { page: { from: 0, size: 10 } } }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
), () => true);

NotificationCenterQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterQuery;
