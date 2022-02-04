import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation ClientsDistributionModal_CreateRuleMutation(
  $ruleName: String!
  $ruleOrder: Int!
) {
  distributionRule {
    create(
      ruleName: $ruleName
      ruleOrder: $ruleOrder
    ) {
      uuid
    }
  }
}
`;

const createClientsDistributionRuleMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

createClientsDistributionRuleMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default createClientsDistributionRuleMutation;
