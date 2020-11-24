import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation SalesRules_UpdateRuleMutation(
  $name: String!,
  $priority: Int!,
  $countries: [String],
  $languages: [String],
  $affiliateUUIDs: [String],
  $sources: [String],
  $type: Rule__Type__Enum!,
  $actions: [RuleActions__Input]!,
  $uuid: String,
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
      uuid: $uuid,
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
