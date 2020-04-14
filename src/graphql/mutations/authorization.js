import gql from 'graphql-tag';

const signInMutation = gql`
  mutation SignInMutation(
    $login: String!
    $password: String!
  ) {
    authorization {
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
          fields_errors
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
    authorization {
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
          fields_errors
        }
      }
    }
  }
`;

export {
  signInMutation,
  chooseDepartmentMutation,
};
