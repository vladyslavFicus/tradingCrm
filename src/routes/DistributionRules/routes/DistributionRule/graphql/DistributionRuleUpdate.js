import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation DistributionRuleUpdate(
    $args: DistributionRuleUpdate__Input
  ) {
    distributionRule {
      updateRule(args: $args)
    }
  }
`;

const DistributionRuleUpdate = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DistributionRuleUpdate.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DistributionRuleUpdate;
