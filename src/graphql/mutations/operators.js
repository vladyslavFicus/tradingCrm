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
      branchId: $branchId,
      department: $department,
      email: $email,
      firstName: $firstName,
      lastName: $lastName,
      phone: $phone,
      password: $password,
      role: $role,
      userType: $userType,
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
  $sip: String,
  $country: String,
) {
  operator {
    updateOperator(
      uuid: $uuid,
      firstName: $firstName,
      lastName: $lastName,
      phoneNumber: $phoneNumber
      sip: $sip
      country: $country
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
        sip
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
          brand
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
          brand
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
        error,
        fields_errors
      }
    }
  }
}`;

const changePassword = gql`mutation changeOperatorPassword(
  $playerUUID: String!,
  $newPassword: String!
) {
  auth {
    changeOperatorPassword(
      operatorUuid: $playerUUID,
      newPassword: $newPassword
    ) {
      success
    }
  }
}`;

const passwordResetRequest = gql`mutation resetOperatorPassword(
  $uuid: String!
) {
  auth {
    resetUserPassword(
      userUuid: $uuid
    ) {
      success
    }
  }
}`;

const changeStatus = gql`mutation changeStatus(
  $uuid: String!,
  $reason: String!,
  $status: String!
) {
  operator {
    changeStatus(
      uuid: $uuid,
      reason: $reason,
      status: $status
    ) {
      success
    }
  }
}`;

const sendInvitation = gql`mutation sendInvitation(
  $uuid: String!
) {
  operator {
    sendInvitation(uuid: $uuid) {
      success
    }
  }
}`;

export {
  addDepartment,
  removeDepartment,
  createOperator,
  updateOperator,
  addExistingOperator,
  changePassword,
  passwordResetRequest,
  sendInvitation,
  changeStatus,
};
