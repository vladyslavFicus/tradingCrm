import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation
  DistributionRules__Migration($uuid: String!) {
    distributionRule {
      migration(uuid: $uuid)
    }
  }
`;

const DistributionRuleMigrationMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DistributionRuleMigrationMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DistributionRuleMigrationMutation;
