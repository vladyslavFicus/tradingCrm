import gql from 'graphql-tag';

const PaymentContentFragment = gql`fragment PaymentContentFragment on Payment {
  _id
  login
  platformType
  accountType
  paymentId
  paymentType
  status
  withdrawStatus
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
    country
  }
  paymentMetadata {
    clientIp
    mobile
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
