import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation UpdateDeskModal_UpdateBranch(
    $uuid: String!
    $name: String!
    $deskType: Desk__Types__Enum
    $language: String
  ) {
    hierarchy {
      updateBranch (
        uuid: $uuid
        name: $name
        deskType: $deskType
        language: $language
      )
    }
  }
`;

const UpdateDeskMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateDeskMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateDeskMutation;
