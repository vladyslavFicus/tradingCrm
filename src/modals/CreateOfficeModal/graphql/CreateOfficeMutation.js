import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation CreateOfficeModal_CreateOfficeMutation(
    $name: String!
    $country: String!
  ) {
    hierarchy {
      createOffice (
        name: $name
        country: $country
      )
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
