import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation ChangeLeverageMutation(
    $accountUUID: String!
    $leverage: Int!
  ) {
    tradingAccount {
      changeLeverage(
        accountUUID: $accountUUID
        leverage: $leverage
      )
    }
  }
`;

const ChangeLeverageMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

ChangeLeverageMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangeLeverageMutation;
