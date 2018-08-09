import gql from 'graphql-tag';

const getClientPaymentsByUuid = gql`query getClientPayments(
  $playerUUID: String!,
  $searchValue: String,
  $type: String,
  $page: Int,
) {
  clientPaymentsByUuid (
    playerUUID: $playerUUID,
    searchValue: $searchValue,
    type: $type,
    page: $page,
  ) {
    size
    content {
      paymentId
      tradingAcc
      symbol
      accountType
      externalReference
    }
  } 
}`;

export {
  getClientPaymentsByUuid,
};
