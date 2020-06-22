import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query PartnersQuery {
  partners {
    data {
      content {
        uuid
        fullName
        createdAt
        status
        statusChangeDate
        country
      }
    }
  }
}`;

const PartnersQuery = ({ children }) => (
  <Query
    query={REQUEST}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

PartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PartnersQuery;
