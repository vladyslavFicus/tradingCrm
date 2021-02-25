import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation UpdateOfficeModal_UpdateBranch(
    $uuid: String!
    $name: String!
    $country: String
  ) {
    hierarchy {
      updateBranch (
        uuid: $uuid
        name: $name
        country: $country
      )
    }
  }
`;

const UpdateOfficeMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateOfficeMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateOfficeMutation;