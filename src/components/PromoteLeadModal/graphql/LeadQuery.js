import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query PromoteLeadModal_LeadQuery(
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

const LeadQuery = ({ children, uuid }) => (
  <Query
    query={REQUEST}
    variables={{ uuid }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

LeadQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default LeadQuery;
