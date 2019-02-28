import gql from 'graphql-tag';

const partnersQuery = gql`query getPartners {
  partners {
    data {
      page
      number
      totalElements
      size
      last
        content {
          uuid
          fullName
          registrationDate
          operatorStatus
          statusChangeDate
          country
        }
    }
    error {
      error
      fields_errors
    }
  }
}`;

const partnerQuery = gql`query getPartnerByUUID(
  $uuid: String!,
) {
  partner(uuid: $uuid) {
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
      authorities {
        data {
          brandId
          department
          id
          role
        }
      }
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
}`;

export {
  partnersQuery,
  partnerQuery,
};
