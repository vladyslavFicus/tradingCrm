import gql from 'graphql-tag';

const addPaymentMutation = gql`mutation createClientPayment(
  $amount: Float!,
  $currency: String!
  $paymentType: String!,
  $externalReference: String,
  $expirationDate: String,
  $login: Int,
  $target: String,
  $source: String,
  $country: String,
  $language: String,
  $paymentMethod: String,
  $playerProfile: PlayerProfileInput,
) {
  payment {
    createClientPayment (
      amount: $amount,
      currency: $currency,
      paymentType: $paymentType,
      externalReference: $externalReference,
      expirationDate: $expirationDate,
      login: $login,
      source: $source,
      target: $target,
      country: $country,
      language: $language,
      paymentMethod: $paymentMethod,
      playerProfile: $playerProfile,
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

const acceptPayment = gql`mutation acceptPayment(
$paymentId: String!,
$paymentMethod: String,
$typeAcc: String,  
) {
  payment {
    acceptPayment (
      paymentId: $paymentId,
      paymentMethod: $paymentMethod,
      typeAcc: $typeAcc,
    ) {
      data {
        success
      }
    }
  }
}`;

export {
  addPaymentMutation,
  acceptPayment,
};
