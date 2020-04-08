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
        fields_errors
        errorParameters
      }
    }
  }
}
`;

const CreateRuleMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreateRuleMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreateRuleMutation;
