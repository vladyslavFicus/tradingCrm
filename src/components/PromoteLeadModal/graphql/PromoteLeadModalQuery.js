import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query PromoteLeadModalQuery(
    $leadId: String!
  ) {
    leadProfile (leadId: $leadId) {
      data {
        _id
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
  }
`;

const PromoteLeadModalQuery = ({ children, uuid }) => (
  <Query
    query={REQUEST}
    variables={{ leadId: uuid }}
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
