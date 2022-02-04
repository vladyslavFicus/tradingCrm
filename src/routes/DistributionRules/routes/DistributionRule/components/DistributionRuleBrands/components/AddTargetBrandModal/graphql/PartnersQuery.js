import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`query AddTargetBrandModal_PartnersQuery {
  cdePartners {
    uuid
    fullName
    brand
  }
}`;

const PartnersQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

PartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PartnersQuery;
