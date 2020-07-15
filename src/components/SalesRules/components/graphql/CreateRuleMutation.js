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
  $type: Rule__Type__Enum!,
  $actions: [RuleActions__Input]!,
) {
  rule {
    createRule (
      name: $name,
      priority: $priority,
      countries: $countries,
      languages: $languages,
      affiliateUUIDs: $affiliateUUIDs,
      sources: $sources,
      type: $type,
      actions: $actions,
    )
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
