import gql from 'graphql-tag';

const conditionalTagsQuery = gql`query conditionalTags(
  $size: Int,
  $page: Int,
  $status: ConditionalTagStatusStatus,
){
  conditionalTags(
    size: $size,
    page: $page,
    status: $status
  ) {
    number,
    page,
    totalElements,
    size,
    last,
    content {
      _id
      tag
      conditionStatus
      conditionType
      count
      uuid
      name
    }
  }
}`;

export {
  conditionalTagsQuery,
};
