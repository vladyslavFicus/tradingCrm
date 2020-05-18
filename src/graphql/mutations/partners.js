import gql from 'graphql-tag';

const updatePartner = gql`mutation updatePartner(
  $uuid: String!
  $firstName: String!
  $lastName: String!
  $phone: String
  $country: String
  $email: String
  $permission: PartnerPermissionUpdate
  $affiliateType: String!
  $externalAffiliateId: String
  $public: Boolean
  $cellexpert: Boolean
  $tradingAccountAutocreation: String
  $tradingAccountType: String
  $tradingAccountCurrency: String
  $satellite: String
) {
  partner {
    updatePartner(
      uuid: $uuid
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      country: $country
      email: $email
      permission: $permission
      affiliateType: $affiliateType
      externalAffiliateId: $externalAffiliateId
      public: $public
      cellexpert: $cellexpert
      tradingAccountAutocreation: $tradingAccountAutocreation
      tradingAccountType: $tradingAccountType
      tradingAccountCurrency: $tradingAccountCurrency
      satellite: $satellite
    ) {
      data {
        _id
        country
        email
        fullName
        firstName
        lastName
        status
        phone
        affiliateType
        externalAffiliateId
        public
        cellexpert
        createdBy
        createdAt
        tradingAccountAutocreation
        tradingAccountType
        tradingAccountCurrency
        statusChangeAuthor
        statusChangeDate
        statusReason
        satellite
        uuid
        permission {
          allowedIpAddresses
          forbiddenCountries
          showNotes
          showSalesStatus
          showFTDAmount
          showKycStatus
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const changePassword = gql`mutation changePassword($playerUUID: String!, $password: String!) {
  profile {
    changePassword(playerUUID: $playerUUID, password: $password) {
      success
    }
  }
}`;

const changeStatus = gql`mutation changeStatus(
  $uuid: String!,
  $reason: String!,
  $status: String!
) {
  partner {
    changeStatus(
      uuid: $uuid,
      reason: $reason,
      status: $status
    ) {
      success
    }
  }
}`;

export {
  changeStatus,
  updatePartner,
  changePassword,
};
