import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

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
