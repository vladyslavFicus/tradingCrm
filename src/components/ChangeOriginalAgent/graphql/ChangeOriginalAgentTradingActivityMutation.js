import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation changeOriginalAgent(
  $tradeId: Int!
  $agentId: String!
  $platformType: String
  ) {
    tradingActivity {
      changeOriginalAgent(
        tradeId: $tradeId
        agentId: $agentId
        platformType: $platformType
      )
    }
  }
`;

const changeOriginalAgent = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

changeOriginalAgent.propTypes = {
  children: PropTypes.func.isRequired,
};

export default changeOriginalAgent;
