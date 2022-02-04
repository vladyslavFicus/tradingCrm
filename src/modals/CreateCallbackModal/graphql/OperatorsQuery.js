import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query CreateCallbackModal_OperatorsQuery {
    operators {
      content {
        uuid
        fullName
        operatorStatus
      }
    }
  }
`;

const OperatorsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">
    {children}
  </Query>
);

OperatorsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default OperatorsQuery;
