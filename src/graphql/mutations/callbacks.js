import gql from 'graphql-tag';

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
  updateCallbackMutation,
};
