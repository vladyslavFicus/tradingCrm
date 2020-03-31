import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation ChangeLeverageRequestMutation($accountUUID: String!, $leverage: Int!) {
    tradingAccount {
      changeLeverageRequest(accountUUID: $accountUUID, leverage: $leverage) {
        success
      }
    }
  }
`;

const ChangeLeverageRequestMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

ChangeLeverageRequestMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangeLeverageRequestMutation;
