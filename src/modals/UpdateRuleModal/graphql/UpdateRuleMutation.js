import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation UpdateRuleMutation(
  $name: String!
  $priority: Int!
  $countries: [String]
  $languages: [String]
  $affiliateUUIDs: [String]
  $sources: [String]
  $type: Rule__Type__Enum!
  $operatorSpreads: [RuleOperatorSpread__Input]
  $uuid: String
  $enableSchedule: Boolean
  $schedules: [RuleSchedule__Input]
) {
  rule {
    createRule (
      name: $name
      priority: $priority
      countries: $countries
      languages: $languages
      affiliateUUIDs: $affiliateUUIDs
      sources: $sources
      type: $type
      operatorSpreads: $operatorSpreads
      uuid: $uuid
      enableSchedule: $enableSchedule
      schedules: $schedules
    )
  }
}
`;

const UpdateRuleMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateRuleMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateRuleMutation;
