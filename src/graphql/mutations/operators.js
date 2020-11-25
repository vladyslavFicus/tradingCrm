import { gql } from '@apollo/client';

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
  createOperator,
  addExistingOperator,
};
