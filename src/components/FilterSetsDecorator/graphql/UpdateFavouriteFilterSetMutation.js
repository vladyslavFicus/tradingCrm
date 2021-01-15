import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
