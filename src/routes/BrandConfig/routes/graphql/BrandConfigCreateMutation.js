import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation createBrandConfig(
    $brandId: String!
    $config: String!
  ) {
    brandConfig {
      create (
        brandId: $brandId
        config: $config
      )
    }
  }
`;

const BrandConfigCreateMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

BrandConfigCreateMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BrandConfigCreateMutation;
