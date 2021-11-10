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

const PartnersQuery = ({ children, initialValues: { brand } }) => (
  <Query query={REQUEST} variables={{ brandId: brand }} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

PartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    brand: PropTypes.string,
  }).isRequired,
};

export default PartnersQuery;
