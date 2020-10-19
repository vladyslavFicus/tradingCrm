import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation DistributionRuleUpdateStatus(
    $uuid: String!
    $ruleStatus: String!
  ) {
    distributionRule {
      updateRuleStatus(
        uuid: $uuid
        ruleStatus: $ruleStatus
      )
    }
  }
`;

const DistributionRuleUpdateStatus = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DistributionRuleUpdateStatus.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DistributionRuleUpdateStatus;
