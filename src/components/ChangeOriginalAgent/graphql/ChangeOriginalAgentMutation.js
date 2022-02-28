import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation ChangeOriginalAgent_ChangeOriginalAgentMutation(
    $paymentId: String!
    $agentId: String
    $agentName: String
  ) {
    payment {
      changeOriginalAgent (
        paymentId: $paymentId
        agentId: $agentId
        agentName: $agentName
      )
    }
  }
`;

const ChangeOriginalAgentMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChangeOriginalAgentMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangeOriginalAgentMutation;
