import gql from 'graphql-tag';

const createRule = gql`mutation createRule(
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
}`;

const createRuleRetention = gql`mutation createRuleRetention(
  $name: String!,
  $priority: Int!,
  $countries: [String],
  $languages: [String],
  $actions: [RuleActionsInputType]!,
  $depositAmountFrom: String!,
  $depositAmountTo: String!,
) {
  rules {
    createRuleRetention (
      name: $name,
      priority: $priority,
      countries: $countries,
      languages: $languages,
      actions: $actions,
      depositAmountFrom: $depositAmountFrom,
      depositAmountTo: $depositAmountTo,
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
      }
    }
  }
}`;

const deleteRule = gql`mutation deleteRule(
  $uuid: String!,
) {
  rules {
    deleteRule(
      uuid: $uuid,
    ) {
      error {
        error
        fields_errors
      }
      data {
        uuid
      }
    } 
  }
}`;

const deleteRuleRetention = gql`mutation deleteRule(
  $uuid: String!,
) {
  rules {
    deleteRuleRetention(
      uuid: $uuid,
    ) {
      error {
        error
        fields_errors
      }
      data {
        uuid
      }
    } 
  }
}`;

export {
  createRule,
  createRuleRetention,
  deleteRule,
  deleteRuleRetention,
};
