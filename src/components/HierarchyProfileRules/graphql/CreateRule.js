import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation CreateRule(
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
}`;

const CreateRule = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreateRule.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreateRule;
