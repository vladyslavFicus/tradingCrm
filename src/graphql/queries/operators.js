import gql from 'graphql-tag';

const operatorsQuery = gql`query getOperators(
  $searchBy: String,
  $country: String,
  $phone: String,
  $status: String,
  $registrationDateFrom: String,
  $registrationDateTo: String,
  $size: Int,
  $page: Int,
) {
  operators(
    searchBy: $searchBy,
    country: $country,
    phone: $phone,
    status: $status,
    registrationDateFrom: $registrationDateFrom,
    registrationDateTo: $registrationDateTo,
    size: $size,
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
        }
    }
    error {
      error
      fields_errors
    }
  }
}`;

export {
  operatorsQuery,
};
