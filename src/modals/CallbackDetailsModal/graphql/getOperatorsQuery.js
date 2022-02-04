import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query CallbackDetailsModal_getOperators {
    operators {
      content {
        uuid
        fullName
        operatorStatus
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
