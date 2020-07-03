import React from 'react';
import PropTypes from 'constants/propTypes';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import { NOTIFICATIONS_SIZE } from '../../../constants';

const REQUEST = gql`query NotificationCenterQuery($args: NotificationCenterSearch__Input) {
  notificationCenter (args: $args) {
    content {
      read
      uuid
      priority
      agent {
        fullName
        uuid
      }
      client {
        uuid
        fullName
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
}`;

const NotificationCenterQuery = ({ children, location }) => {
  const filters = get(location, 'query.filters', null);

  return (
    <Query
      query={REQUEST}
      fetchPolicy="cache-and-network"
      variables={{
        args: {
          ...filters,
          hierarchical: true,
          page: { from: 0, size: NOTIFICATIONS_SIZE },
        },
      }}
    >
      {children}
    </Query>
  );
};

NotificationCenterQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default NotificationCenterQuery;
