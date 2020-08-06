import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation CreateRuleRetention(
  $name: String!,
  $priority: Int!,
  $countries: [String],
  $languages: [String],
  $actions: [RuleActions__Input]!,
  $depositAmountFrom: Int!,
  $depositAmountTo: Int!,
  $uuid: String,
) {
  rule {
    createRuleRetention (
      name: $name,
      priority: $priority,
      countries: $countries,
      languages: $languages,
      actions: $actions,
      depositAmountFrom: $depositAmountFrom,
      depositAmountTo: $depositAmountTo,
      uuid: $uuid,
    )
  }
}`;

const CreateRuleRetention = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreateRuleRetention.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreateRuleRetention;
