import gql from 'graphql-tag';

const addOperatorToBranch = gql`mutation addOperatorToBranch(
  $branchId: String!
  $operatorId: String!
) {
  operator {
    addOperatorToBranch (
      branchId: $branchId
      operatorId: $operatorId
    )
  }
}`;

const removeOperatorFromBranch = gql`mutation removeOperatorFromBranch(
$branchId: String!
$operatorId: String!
) {
  operator {
    removeOperatorFromBranch (
      branchId: $branchId
      operatorId: $operatorId
    )
  }
}`;

const updateUser = gql`mutation updateUser(
  $operatorId: String!
  $userType: String
) {
  operator {
    updateOperatorUserType (
      operatorId: $operatorId
      userType: $userType
    )
  }
}`;

export {
  addOperatorToBranch,
  removeOperatorFromBranch,
  updateUser,
};
