import gql from 'graphql-tag';

const unlockLoginMutation = gql`mutation unlockLogin($playerUUID: String!) {
  auth {
    unlockLogin(playerUUID: $playerUUID) {
      data {
        success
      }
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

const tokenRenew = gql`mutation tokenRenew {
  auth {
    tokenRenew {
      token
    }
  }
}`;

const resetPasswordMutation = gql`mutation resetPassword(
  $password: String!
  $repeatPassword: String!
  $token: String!
) {
  auth {
    resetPassword(
      password: $password
      repeatPassword: $repeatPassword
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
  tokenRenew,
  logout,
};
