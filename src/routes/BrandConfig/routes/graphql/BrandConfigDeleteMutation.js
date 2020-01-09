import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation deleteBrandConfig(
    $brandId: String!
  ) {
    brandConfig {
      delete (
        brandId: $brandId
      ) {
        error {
          error
          fields_errors
        }
        success
      }
    }
  }
`;

const BrandConfigDeleteMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

BrandConfigDeleteMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BrandConfigDeleteMutation;
