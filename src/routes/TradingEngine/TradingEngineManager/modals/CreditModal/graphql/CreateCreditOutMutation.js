import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation TradingEngine_CreateCreditOutMutation(
  $amount: Float!
  $comment: String
  $accountUuid: String!
) {
  tradingEngine {
    createCreditOut(
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

const CreateCreditOutMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreateCreditOutMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreateCreditOutMutation;
