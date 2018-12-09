import gql from 'graphql-tag';

const addPaymentMutation = gql`mutation createClientPayment(
  $amount: Int!,
  $currency: String!
  $paymentType: String!,
  $externalReference: String,
  $expirationDate: String,
  $login: String,
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

export {
  addPaymentMutation,
};
