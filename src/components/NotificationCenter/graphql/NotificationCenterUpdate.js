import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation NotificationCenterUpdate(
    $incUuids: [String]
    $excUuids: [String]
    $totalElements: Int!
    $searchParams: NotificationCenterSearch__Input
  ) {
    notificationCenter {
      update(
        incUuids: $incUuids
        excUuids: $excUuids
        totalElements: $totalElements
        searchParams: $searchParams
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
