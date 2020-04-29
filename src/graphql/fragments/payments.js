import gql from 'graphql-tag';

const PaymentContentFragment = gql`fragment PaymentContentFragment on PaymentTrading {
  _id
  login
  platformType
  accountType
  paymentId
  paymentType
  status
  withdrawStatus
  withdrawalScheduledTime
  currency
  createdBy
  creationTime
  paymentMethod
  paymentAggregator
  amount
  country
  language
  brandId
  externalReference
  paymentMigrationId
  userMigrationId
  normalizedAmount
  declineReason
  playerProfile {
    uuid
    firstName
    lastName
    fullName
    country
  }
  paymentMetadata {
    clientIp
    isMobile
    userAgent
    country
  }
  originalAgent {
    uuid
    fullName
  }
  note {
    ...NoteFragment
  }
  modifiedBy
  statusChangedAt
  warnings
}`;

export {
  PaymentContentFragment,
};
