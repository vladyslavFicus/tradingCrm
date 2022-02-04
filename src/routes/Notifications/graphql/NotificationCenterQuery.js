import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query NotificationCenterQuery($args: NotificationCenterSearch__Input) {
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
        details
      }
      last
      size
      number
      totalElements
    }
  }
`;

const NotificationCenterQuery = ({ children, location }) => {
  const filters = location.state?.filters || {};

  return (
    <Query
      query={REQUEST}
      fetchPolicy="cache-and-network"
      variables={{
        args: {
          ...filters,
          hierarchical: true,
          page: {
            from: 0,
            size: 20,
          },
        },
      }}
      context={{ batch: false }}
    >
      {children}
    </Query>
  );
};

NotificationCenterQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default NotificationCenterQuery;
