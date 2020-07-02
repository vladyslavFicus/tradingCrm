import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query getOperatorMiniProfile($uuid: String!) {
    operator(uuid: $uuid) {
      _id
      country
      fullName
      operatorStatus
      registrationDate
      uuid
      authorities {
        department
        id
        role
      }
    }
  }
`;

const OperatorMiniProfileQuery = ({ uuid, children }) => (
  <Query query={REQUEST} variables={{ uuid }} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

OperatorMiniProfileQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default OperatorMiniProfileQuery;
