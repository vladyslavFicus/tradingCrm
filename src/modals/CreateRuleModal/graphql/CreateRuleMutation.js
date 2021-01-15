import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation CreateRuleMutation(
  $name: String!
  $priority: Int!
  $countries: [String]
  $languages: [String]
  $affiliateUUIDs: [String]
  $sources: [String]
  $type: Rule__Type__Enum!
  $operatorSpreads: [RuleOperatorSpread__Input]
  $parentBranch: String
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
      parentBranch: $parentBranch
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
