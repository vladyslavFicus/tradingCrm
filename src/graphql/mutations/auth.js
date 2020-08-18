import gql from 'graphql-tag';

const unlockLoginMutation = gql`mutation unlockLogin($uuid: String!) {
  auth {
    unlockLogin(uuid: $uuid)
  }
}`;

const resetPasswordMutation = gql`mutation resetPassword(
  $password: String!
  $token: String!
) {
  auth {
    resetPassword(
      password: $password
      token: $token
    )
  }
}`;

export {
  resetPasswordMutation,
  unlockLoginMutation,
};
