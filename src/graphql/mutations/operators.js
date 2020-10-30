import gql from 'graphql-tag';

const createOperator = gql`mutation createOperator(
  $branchId: String,
  $department: String!,
  $email: String!,
  $firstName: String!,
  $lastName: String!,
  $password: String!,
  $phone: String,
  $role: String!,
  $userType: String!,
) {
  operator {
    createOperator(
      branchId: $branchId
      department: $department
      email: $email
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      password: $password
      role: $role
      userType: $userType
    ) {
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
  }
}`;

const updateOperator = gql`mutation updateOperator(
  $uuid: String!,
  $firstName: String!,
  $lastName: String!,
  $phoneNumber: String,
  $sip: String,
  $country: String,
) {
  operator {
    updateOperator(
      uuid: $uuid
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      sip: $sip
      country: $country
    ) {
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
    }
  }
}`;

const removeDepartment = gql`mutation removeDepartment(
  $uuid: String!,
  $department: String!,
  $role: String!,
) {
  auth {
    removeAuthority(
      uuid: $uuid
      department: $department
      role: $role
    )
  }
}`;

const addExistingOperator = gql`mutation addExistingOperator(
  $email: String!,
  $department: String!,
  $role: String!,
  $branchId: String,
) {
  operator {
    addExistingOperator(
      email: $email
      department: $department
      role: $role
      branchId: $branchId
    ) {
      uuid
    }
  }
}`;

export {
  removeDepartment,
  createOperator,
  updateOperator,
  addExistingOperator,
};
