import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query CallbackDetailsModal_getOperators {
    operators {
      data {
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
      error {
        error
        fields_errors
      }
    }
  }
`;

const getOperatorsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">
    {children}
  </Query>
);

getOperatorsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default getOperatorsQuery;
