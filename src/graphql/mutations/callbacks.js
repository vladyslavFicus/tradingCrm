import gql from 'graphql-tag';

const createCallbackMutation = gql`mutation createCallback(
  $userId: String!,
  $operatorId: String!,
  $callbackTime: String!,
) {
  callback {
    create(
      userId: $userId,
      operatorId: $operatorId,
      callbackTime: $callbackTime,
    ) {
      data {
        _id
        callbackTime
        operatorId
        status
        operator {
          fullName
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

export {
  createCallbackMutation,
};
