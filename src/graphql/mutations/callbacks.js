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

const updateCallbackMutation = gql`mutation updateCallback(
  $callbackId: String!,
  $callbackTime: String,
  $operatorId: String,
  $status: CallbackStatusEnum,
) {
  callback {
    update(
      callbackId: $callbackId,
      callbackTime: $callbackTime,
      operatorId: $operatorId,
      status: $status,
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
  updateCallbackMutation,
};
