import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query Operator_OperatorQuery(
    $uuid: String!
  ) {
    operator(uuid: $uuid) {
      email
      uuid
    }
  }
`;

const OperatorQuery = ({ children, auth: { uuid } }) => (
  <Query
    query={REQUEST}
    variables={{ uuid }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

OperatorQuery.propTypes = {
  children: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
  }).isRequired,
};

export default OperatorQuery;
