import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query NotificationGridGilters_OperatorsQuery {
  operators  {
    data {
      content {
        uuid
        fullName
        operatorStatus
      }
    }
    error {
      error
      fields_errors
    }
  }
}`;

const OperatorsQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

OperatorsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default OperatorsQuery;