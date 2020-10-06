import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation ClientsDistributionRuleUpdate(
    $args: DistributionRuleUpdate__Input
  ) {
    distributionRule {
      updateRule(args: $args)
    }
  }
`;

const ClientsDistributionRuleUpdate = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ClientsDistributionRuleUpdate.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ClientsDistributionRuleUpdate;
