import gql from 'graphql-tag';

const createOperator = gql`mutation createOperator(
  $branchId: String,
  $department: String!,
  $email: String!,
  $firstName: String!,
  $lastName: String!,
  $phone: String,
  $role: String!,
  $sendMail: Boolean!,
  $userType: String!,
) {
  operator {
    createOperator(
      branchId: $branchId,
      department: $department,
      email: $email,
      firstName: $firstName,
      lastName: $lastName,
      phone: $phone,
      role: $role,
      userType: $userType,
      sendMail: $sendMail,
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

const updateOperator = gql`mutation updateOperator(
  $uuid: String!,
  $firstName: String!,
  $lastName: String!,
  $phoneNumber: String,
  $country: String,
) {
  operator {
    updateOperator(
      uuid: $uuid,
      firstName: $firstName,
      lastName: $lastName,
      phoneNumber: $phoneNumber
      country: $country,
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
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const removeDepartment = gql`mutation removeDepartment(
  $uuid: String!,
  $department: String!,
  $role: String!,
) {
  operator {
    removeDepartment(
      uuid: $uuid,
      department: $department,
      role: $role,
    ) {
      data {
        authorities {
          brandId
          department
          id
          role
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const addDepartment = gql`mutation addDepartment(
  $uuid: String!,
  $department: String!,
  $role: String!,
) {
  operator {
    addDepartment(
      uuid: $uuid,
      department: $department,
      role: $role,
    ) {
      data {
        authorities {
          brandId
          department
          id
          role
        }
      }
      error {
        error
        fields_errors
      }
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
      email: $email,
      department: $department,
      role: $role,
      branchId: $branchId,
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

export {
  addDepartment,
  removeDepartment,
  createOperator,
  updateOperator,
  addExistingOperator,
};
