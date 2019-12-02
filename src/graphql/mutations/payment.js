import gql from 'graphql-tag';

const addPaymentMutation = gql`mutation createClientPayment(
  $accountUUID: String!,
  $amount: Float!,
  $country: String,
  $externalReference: String,
  $expirationDate: String,
  $login: Int,
  $paymentType: String!,
  $paymentMethod: String,
  $profileUUID: String,
  $source: Int,
  $target: Int,
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
