import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query LeadProfileTab_LeadQuery(
    $uuid: String!
  ) {
    lead (uuid: $uuid) {
      _id
      uuid
      brandId
      name
      surname
      phone
      mobile
      email
      country
      birthDate
      gender
      city
    }
  }
`;

const LeadQuery = ({ match: { params: { id: uuid } }, children }) => (
  <Query query={REQUEST} variables={{ uuid }}>
    {children}
  </Query>
);

LeadQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default LeadQuery;
