/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

const registeredUsersQuery = gql`query getRegUsersStat(
  $registrationDateFrom: String!,
  $registrationDateTo: String!,
) {
  statistics {
    registrations (
      registrationDateFrom: $registrationDateFrom,
      registrationDateTo: $registrationDateTo,
    ) {
      error {
        error
      }
      data {
        entities {
          name
          entries
        }
        total
      }
    } 
  }
}`;

export {
  registeredUsersQuery,
};
