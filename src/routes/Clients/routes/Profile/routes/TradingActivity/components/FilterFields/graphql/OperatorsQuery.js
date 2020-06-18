import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

const REQUEST = gql`query OperatorsQuery {
  operators {
    data {
      content {
        uuid
        fullName
        operatorStatus
        hierarchy {
          uuid
          userType
        }
      }
    }
    error {
      error
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
