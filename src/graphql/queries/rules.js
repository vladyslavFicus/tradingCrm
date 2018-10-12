import gql from 'graphql-tag';

const getRules = gql`query getRules(
  $uuid: [String],
  $country: String,
  $language: String,
  $createdByOrUuid: String,
  $name: String,
  $type: RuleTypeEnum,
  $parentId: String,
) {
  rules (
    uuid: $uuid,
    country: $country,
    language: $language,
    createdByOrUuid: $createdByOrUuid,
    name: $name,
    type: $type,
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
};
