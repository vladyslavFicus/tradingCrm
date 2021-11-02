import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query DistributionRuleSettings_PartnersQuery($brandId: String) {
  partners(brandId: $brandId) {
    content {
      uuid
      fullName
      brand
    }
  }
}`;

const PartnersQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">
    {children}
  </Query>
);

PartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PartnersQuery;
