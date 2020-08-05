import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation CreateDeskModal_CreateDesk(
    $name: String!
    $deskType: Desk__Types__Enum!
    $officeUuid: String!
    $language: String!
  ) {
    hierarchy {
      createDesk (
        name: $name
        deskType: $deskType
        officeId: $officeUuid
        language: $language
      )
    }
  }
`;

const CreateDeskMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreateDeskMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreateDeskMutation;
