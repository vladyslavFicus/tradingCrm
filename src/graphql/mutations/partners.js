import gql from 'graphql-tag';

const createPartner = gql`mutation createPartner(
  $branchId: String,
  $email: String!,
  $firstName: String!,
  $lastName: String!,
  $password: String!,
  $phone: String,
) {
  partner {
    createPartner(
      branchId: $branchId,
      email: $email,
      firstName: $firstName,
      lastName: $lastName,
      phone: $phone,
      password: $password,
    ) {
      data {
        country
        email
        fullName
        firstName
        lastName
        operatorStatus
        phoneNumber
        registeredBy
        registrationDate
        statusChangeAuthor
        statusChangeDate
        statusReason
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
  $phoneNumber: String,
  $country: String,
  $allowedIpAddresses: [String],
  $forbiddenCountries: [String],
) {
  partner {
    updatePartner(
      uuid: $uuid,
      firstName: $firstName,
      lastName: $lastName,
      phoneNumber: $phoneNumber
      country: $country,
      allowedIpAddresses: $allowedIpAddresses,
      forbiddenCountries: $forbiddenCountries,
    ) {
      data {
        _id
        country
        email
        fullName
        firstName
        lastName
        operatorStatus
        phoneNumber
        registeredBy
        registrationDate
        statusChangeAuthor
        statusChangeDate
        statusReason
        uuid
        forexOperator {
          data {
            permission {
              allowedIpAddresses
              forbiddenCountries
            }
          }
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

export {
  createPartner,
  updatePartner,
};
