import gql from 'graphql-tag';

const unlockLoginMutation = gql`mutation unlockLogin($playerUUID: String!) {
  auth {
    unlockLogin(uuid: $playerUUID) {
      success
      error {
        error
      }
    }
  }
}`;

const logout = gql`mutation logout {
  auth {
    logout {
      success
    }
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
    ) {
      success
      error {
        error
      }
    }
  }
}`;

export {
  resetPasswordMutation,
  unlockLoginMutation,
  logout,
};
