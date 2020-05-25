import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation createRule(
  $name: String!,
  $priority: Int!,
  $countries: [String],
  $languages: [String],
  $affiliateUUIDs: [String],
  $sources: [String],
  $type: RuleTypeEnum!,
  $actions: [RuleActionsInputType]!,
  $uuid: String,
) {
  rules {
    createRule (
      name: $name,
      priority: $priority,
      countries: $countries,
      languages: $languages,
      affiliateUUIDs: $affiliateUUIDs,
      sources: $sources,
      type: $type,
      actions: $actions,
      uuid: $uuid,
    ) {
      data {
        actions {
          id
          parentBranch
          parentUser
          ruleType
        }
        uuid
        countries
        languages
        priority
        name
        type
        updatedBy
      }
      error {
        error
        errorParameters
      }
    }
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
