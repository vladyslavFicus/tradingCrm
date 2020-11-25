import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

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
