import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`query PartnersQuery {
  partners {
    content {
      uuid
      fullName
      createdAt
      status
      statusChangeDate
      country
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
