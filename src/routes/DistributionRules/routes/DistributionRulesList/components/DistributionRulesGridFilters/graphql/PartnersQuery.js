import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`query DistributionRulesList_PartnersQuery {
  partners {
    content {
      uuid
      fullName
    }
  }
}
`;

const PartnersQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

PartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PartnersQuery;
