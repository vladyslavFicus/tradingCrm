import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation createClientsDistributionRule(
  $ruleName: String!
  $ruleOrder: Int!
) {
  distributionRule {
    create(
      ruleName: $ruleName
      ruleOrder: $ruleOrder
    )
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
