import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation TradingEngine_CreateCreditInMutation(
  $amount: Float!
  $comment: String
  $accountUuid: String!
) {
  tradingEngine {
    createCreditIn(
      amount: $amount
      comment: $comment
      accountUuid: $accountUuid
    ) {
      accountUuid
      credit
      balance
    }
  }
}
`;

const CreateCreditInMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreateCreditInMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreateCreditInMutation;
