import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query Operator_OperatorLockStatus(
    $uuid: String!
  ) {
    loginLock(
      uuid: $uuid
    ) {
      lock
    }
  }
`;

const OperatorLockStatusQuery = ({ children, match: { params: { id } } }) => (
  <Query query={REQUEST} variables={{ uuid: id }} fetchPolicy="network-only">
    {children}
  </Query>
);

OperatorLockStatusQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default OperatorLockStatusQuery;
