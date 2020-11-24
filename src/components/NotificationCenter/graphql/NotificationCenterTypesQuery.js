import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query NotificationCenterTypesQuery {
    notificationCenterTypes
  }
`;

const NotificationCenterTypesQuery = ({ children }) => (
  <Query query={REQUEST}>{children}</Query>
);

NotificationCenterTypesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterTypesQuery;
