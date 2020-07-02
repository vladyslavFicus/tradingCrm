import gql from 'graphql-tag';

const getRules = gql`query getRules(
  $uuid: [String],
  $country: String,
  $language: String,
  $createdByOrUuid: String,
  $name: String,
  $type: Rule__Type__Enum,
  $parentId: String,
  $branchUuid: String,
) {
  rules (
    uuid: $uuid,
    country: $country,
    language: $language,
    createdByOrUuid: $createdByOrUuid,
    name: $name,
    type: $type,
    parentId: $parentId,
    branchUuid: $branchUuid,
  ) {
    actions {
      id
      parentBranch
      parentUser
      ruleType
      operatorSpreads {
        id,
        operator {
          fullName,
          uuid,
        },
        percentage,
      },
    }
    uuid
    countries
    languages
    partners {
      uuid,
      fullName,
    }
    sources
    priority
    name
    type
    updatedBy
    createdBy
  }
}`;

const getRulesRetention = gql`query getRulesRetention(
  $uuid: [String],
  $country: String,
  $language: String,
  $createdByOrUuid: String,
  $name: String,
  $parentId: String,
) {
  rulesRetention (
    uuid: $uuid,
    country: $country,
    language: $language,
    createdByOrUuid: $createdByOrUuid,
    name: $name,
    parentId: $parentId,
  ) {
    error {
      error
      fields_errors
    }
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
      createdBy
    }
  }
}`;

export {
  getRules,
  getRulesRetention,
};
