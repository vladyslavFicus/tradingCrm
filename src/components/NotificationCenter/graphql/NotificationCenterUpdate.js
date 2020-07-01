import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation NotificationCenterUpdate(
    $incUuids: [String]
    $excUuids: [String]
    $totalElements: Int!
  ) {
    notificationCenter {
      update(
        incUuids: $incUuids
        excUuids: $excUuids
        totalElements: $totalElements
      )
    }
  }
`;

const NotificationCenterUpdate = ({ children }) => (
  <Mutation mutation={REQUEST}>{children}</Mutation>
);

NotificationCenterUpdate.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterUpdate;
