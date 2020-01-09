import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation createBrandConfig(
    $brandId: String!
    $config: String!
  ) {
    brandConfig {
      create (
        brandId: $brandId
        config: $config
      ) {
        data
        error {
          error
          fields_errors
        }
      }
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
