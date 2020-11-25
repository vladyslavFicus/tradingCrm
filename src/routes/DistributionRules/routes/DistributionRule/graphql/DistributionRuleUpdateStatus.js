import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

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
