import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query NotificationCenterTypesQuery {
    notificationCenterTypes {
      data
      error {
        error
      }
    }
  }
`;

const NotificationCenterTypesQuery = ({ children }) => (
  <Query query={REQUEST}>{children}</Query>
);

NotificationCenterTypesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterTypesQuery;
