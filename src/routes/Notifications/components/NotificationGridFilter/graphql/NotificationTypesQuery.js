import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query NotificationGridFilters_NotificationTypesQuery {
  notificationCenterTypes
}`;

const NotificationTypesQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

NotificationTypesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationTypesQuery;
