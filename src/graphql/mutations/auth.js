import gql from 'graphql-tag';

const signInMutation = gql`
  mutation SignInMutation(
    $login: String!
    $password: String!
  ) {
    auth {
      signIn(
        login: $login
        password: $password
      ) {
        data {
          uuid
          brandToAuthorities
          token
        }
        error {
          error
        }
      }
    }
  }
`;

const chooseDepartmentMutation = gql`
  mutation ChooseDepartmentMutation(
    $brand: String!
    $department: String!
    $role: String!
  ) {
    auth {
      chooseDepartment(
        brand: $brand
        department: $department
        role: $role
      ) {
        data {
          uuid
          token
        }
        error {
          error
        }
      }
    }
  }
`;

const unlockLoginMutation = gql`mutation unlockLogin($uuid: String!) {
  auth {
    unlockLogin(uuid: $uuid)
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
    )
  }
}`;

export {
  signInMutation,
  chooseDepartmentMutation,
  resetPasswordMutation,
  unlockLoginMutation,
  logout,
};
