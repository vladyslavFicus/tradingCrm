import gql from 'graphql-tag';

const createRule = gql`mutation createRule(
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
}`;

const createRuleRetention = gql`mutation createRuleRetention(
  $name: String!,
  $priority: Int!,
  $depositCount: Int,
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
      depositCount: $depositCount,
      countries: $countries,
      languages: $languages,
      actions: $actions,
      depositAmountFrom: $depositAmountFrom,
      depositAmountTo: $depositAmountTo,
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
        depositCount
        name
        type
        updatedBy
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const deleteRule = gql`mutation deleteRule(
  $uuid: String!
) {
  rule {
    deleteRule(uuid: $uuid)
  }
}`;

const deleteRuleRetention = gql`mutation deleteRule(
  $uuid: String!
) {
  rule {
    deleteRuleRetention(uuid: $uuid)
  }
}`;

export {
  createRule,
  createRuleRetention,
  deleteRule,
  deleteRuleRetention,
};
