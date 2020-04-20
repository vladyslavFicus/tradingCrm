import gql from 'graphql-tag';

const addPaymentMutation = gql`mutation createClientPayment(
  $accountUUID: String,
  $amount: Float!,
  $country: String,
  $externalReference: String,
  $expirationDate: String,
  $login: Int,
  $paymentType: String!,
  $paymentMethod: String,
  $profileUUID: String,
  $source: String,
  $target: String,
) {
  payment {
    createClientPayment (
      accountUUID: $accountUUID,
      amount: $amount,
      paymentType: $paymentType,
      externalReference: $externalReference,
      expirationDate: $expirationDate,
      login: $login,
      source: $source,
      target: $target,
      country: $country,
      paymentMethod: $paymentMethod,
      profileUUID: $profileUUID
    ) {
      data {
        paymentId
        redirectLink
        generationDate
      }
      error {
        error
      }
    }
  }
}`;

const changeOriginalAgent = gql`mutation changeOriginalAgent(
  $paymentId: String!,
  $agentId: String,
  $agentName: String,
) {
  payment {
    changeOriginalAgent (
      paymentId: $paymentId,
      agentId: $agentId,
      agentName: $agentName,
    ) {
      success
    }
  }
}`;

export {
  addPaymentMutation,
  changeOriginalAgent,
};
