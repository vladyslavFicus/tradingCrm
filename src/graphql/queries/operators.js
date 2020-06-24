import gql from 'graphql-tag';

const operatorsQuery = gql`query getOperators(
  $searchBy: String,
  $country: String,
  $phone: String,
  $status: String,
  $registrationDateFrom: String,
  $registrationDateTo: String,
  $page: Page__Input,
) {
  operators(
    searchBy: $searchBy,
    country: $country,
    phone: $phone,
    status: $status,
    registrationDateFrom: $registrationDateFrom,
    registrationDateTo: $registrationDateTo,
    page: $page,
  ) {
    data {
      page
      number
      totalElements
      size
      last
      content {
        uuid
        fullName
        operatorStatus
        hierarchy {
          uuid
          userType
        }
      }
    }
    error {
      error
      fields_errors
    }
  }
}`;

const managementOperatorsQuery = gql`query getOperators(
  $searchBy: String,
  $country: String,
  $status: String,
  $registrationDateFrom: String,
  $registrationDateTo: String,
  $page: Page__Input,
) {
  operators(
    searchBy: $searchBy,
    country: $country,
    status: $status,
    registrationDateFrom: $registrationDateFrom,
    registrationDateTo: $registrationDateTo,
    page: $page,
  ) {
    data {
      page
      number
      totalElements
      size
      last
      content {
        uuid
        fullName
        country
        registrationDate
        operatorStatus
        statusChangeDate
      }
    }
    error {
      error
      fields_errors
    }
  }
}`;

const operatorQuery = gql`query getOperatorByUUID(
  $uuid: String!,
) {
  operator(uuid: $uuid) {
    data {
      _id
      country
      email
      fullName
      firstName
      lastName
      operatorStatus
      phoneNumber
      sip
      registeredBy
      registrationDate
      statusChangeAuthor
      statusChangeDate
      statusReason
      uuid
      authorities {
        data {
          brand
          department
          id
          role
        }
      }
      hierarchy {
        uuid
        userType
      }
    }
    error {
      error
      fields_errors
    }
  }
}`;

export {
  operatorQuery,
  operatorsQuery,
  managementOperatorsQuery,
};
