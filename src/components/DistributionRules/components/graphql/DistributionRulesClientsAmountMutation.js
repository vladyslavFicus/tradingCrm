import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation
  DistributionRules__ClientsAmount($uuid: String!) {
    distributionRule {
      clientsAmount(uuid: $uuid) {
        clientsAmount
      }
    }
  }
`;

const DistributionRuleClientsAmountMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DistributionRuleClientsAmountMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DistributionRuleClientsAmountMutation;
