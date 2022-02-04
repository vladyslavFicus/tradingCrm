import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation UpdateFavouriteFilterSetMutation(
    $favourite: Boolean!
    $uuid: String!
  ) {
    filterSet {
      updateFavourite(
        favourite: $favourite
        uuid: $uuid
      )
    }
  }
`;

const UpdateFavouriteFilterSetMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateFavouriteFilterSetMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateFavouriteFilterSetMutation;
