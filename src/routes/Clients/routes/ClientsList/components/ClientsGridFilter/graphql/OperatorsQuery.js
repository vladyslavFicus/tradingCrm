import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query ClientsGridFilter_OperatorsQuery {
  operators {
    content {
      uuid
      fullName
      operatorStatus
      hierarchy {
        parentBranches {
          branchType
          uuid
        }
      }
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