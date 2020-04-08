import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query NotificationGridFilters_TypesQuery {
  notificationCenterTypes {
    data 
    error {
      error
      fields_errors
    }
  }
}`;

const TypesQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

TypesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default TypesQuery;
