import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query leadProfileQuery(
  $uuid: String!,
) {
  lead (
    uuid: $uuid,
  ) {
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
}`;

const LeadProfileQuery = ({ match: { params: { id: uuid } }, children }) => (
  <Query query={REQUEST} variables={{ uuid }}>
    {children}
  </Query>
);

LeadProfileQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default LeadProfileQuery;
