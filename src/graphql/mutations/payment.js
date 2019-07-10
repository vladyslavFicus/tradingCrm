import gql from 'graphql-tag';

const addPaymentMutation = gql`mutation createClientPayment(
  $amount: Float!,
  $paymentType: String!,
  $externalReference: String,
  $expirationDate: String,
  $login: Int,
  $target: Int,
  $source: Int,
  $country: String,
  $language: String,
  $paymentMethod: String,
  $playerProfile: PlayerProfileInput,
) {
  payment {
    createClientPayment (
      amount: $amount,
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
  $declineReason: String,
  $typeAcc: String,  
) {
  payment {
    acceptPayment (
      paymentId: $paymentId,
      paymentMethod: $paymentMethod,
      declineReason: $declineReason,
      typeAcc: $typeAcc,
    ) {
      data {
        success
      }
    }
  }
}`;

const changePaymentMethod = gql`mutation changePaymentMethod(
  $paymentId: String!,
  $paymentMethod: String,
) {
  payment {
    changePaymentMethod (
      paymentId: $paymentId,
      paymentMethod: $paymentMethod,
    ) {
      data {
        success
      }
    }
  }
}`;

const changePaymentStatus = gql`mutation changePaymentStatus(
  $paymentId: String!,
  $paymentStatus: String,
) {
  payment {
    changePaymentStatus (
      paymentId: $paymentId,
      paymentStatus: $paymentStatus,
    ) {
      data {
        success
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
  acceptPayment,
  changePaymentStatus,
  changePaymentMethod,
  changeOriginalAgent,
};
