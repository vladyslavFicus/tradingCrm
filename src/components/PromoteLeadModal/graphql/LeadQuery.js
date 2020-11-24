import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query PromoteLeadModalQuery(
    $uuid: String!
  ) {
    lead (uuid: $uuid) {
      _id
      uuid
      email
      phone
      gender
      birthDate
      name
      surname
      country
      language
      mobile
    }
  }
`;

const PromoteLeadModalQuery = ({ children, uuid }) => (
  <Query
    query={REQUEST}
    variables={{ uuid }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

PromoteLeadModalQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default PromoteLeadModalQuery;
