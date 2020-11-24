import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation updateBrandConfig(
    $brandId: String!
    $config: String!
  ) {
    brandConfig {
      update (
        brandId: $brandId
        config: $config
      )
    }
  }
`;

const BrandConfigUpdateMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

BrandConfigUpdateMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BrandConfigUpdateMutation;
