import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation ClientsDistributionModal_UpdateRuleMutation(
  $ruleName: String
  $ruleOrder: Int
  $uuid: String!
) {
  distributionRule {
    update(
      ruleName: $ruleName
      ruleOrder: $ruleOrder
      uuid: $uuid
    )
  }
}
`;

const updateClientsDistributionRuleMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

updateClientsDistributionRuleMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default updateClientsDistributionRuleMutation;
