import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation AddTeamModal_CreateTeamMutation(
    $teamName: String!,
    $deskUuid: String!,
  ) {
    hierarchy {
      createTeam (
        name: $teamName,
        deskId: $deskUuid,
      )
    }
  }
`;

const CreateTeamMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreateTeamMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreateTeamMutation;
