import gql from 'graphql-tag';

const createRule = gql`mutation createRule(
  $name: String!,
  $priority: Int!,
  $countries: [String],
  $languages: [String],
  $type: RuleTypeEnum!,
  $actions: [RuleActionsInputType]!,
  $createdBy: String!,
) {
  rules {
    createRule (
      name: $name,
      priority: $priority,
      countries: $countries,
      languages: $languages,
      type: $type,
      actions: $actions,
      createdBy: $createdBy,
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

const createRuleRetention = gql`mutation createRuleRetention(
  $name: String!,
  $priority: Int!,
  $countries: [String]!,
  $languages: [String]!,
  $actions: [RuleActionsInputType]!,
  $createdBy: String!,
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
      createdBy: $createdBy,
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
