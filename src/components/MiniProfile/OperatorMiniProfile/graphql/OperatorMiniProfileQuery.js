import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

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
