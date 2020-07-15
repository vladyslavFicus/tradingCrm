import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'constants/propTypes';
import { Query } from 'react-apollo';

export const REQUEST = gql`query ChangeOriginalAgent_getOperators {
  operators {
    page
    number
    totalElements
    size
    last
    content {
      uuid
      fullName
      operatorStatus
    }
  }
}`;

const OperatorsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

OperatorsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default OperatorsQuery;
