import gql from 'graphql-tag';

const createPartner = gql`mutation createPartner(
  $email: String!
  $firstName: String!
  $lastName: String!
  $phone: String
  $password: String!
  $affiliateType: String!
  $externalAffiliateId: String!
  $public: Boolean
  $cellexpert: Boolean
) {
  partner {
    createPartner(
      email: $email
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      password: $password
      affiliateType: $affiliateType
      externalAffiliateId: $externalAffiliateId
      public: $public
      cellexpert: $cellexpert
    ) {
      data {
        uuid
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const updatePartner = gql`mutation updatePartner(
  $uuid: String!,
  $firstName: String!,
  $lastName: String!,
  $phone: String,
  $country: String,
  $email: String,
  $permission: PartnerPermissionUpdate,
) {
  partner {
    updatePartner(
      uuid: $uuid,
      firstName: $firstName,
      lastName: $lastName,
      phone: $phone,
      country: $country,
      email: $email,
      permission: $permission,
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
        createdBy
        createdAt
        statusChangeAuthor
        statusChangeDate
        statusReason
        uuid
        permission {
          allowedIpAddresses
          forbiddenCountries
          showNotes
          showSalesStatus
          showFTDAmount
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
  createPartner,
  updatePartner,
  changePassword,
};
