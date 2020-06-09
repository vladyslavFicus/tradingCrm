import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation CreateOfficeModal_CreateOfficeMutation(
    $name: String!
    $country: String!
  ) {
    hierarchy {
      createOffice (
        name: $name
        country: $country
      ) {
        data
        error
      }
    }
  }
`;

const CreateOfficeMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreateOfficeMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreateOfficeMutation;