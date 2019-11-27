import gql from 'graphql-tag';

const signInMutation = gql`mutation signIn($login: String!, $password: String!) {
  authorization {
    signIn(login: $login, password: $password) {
      data {
        uuid
        departmentsByBrand
        token
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const chooseDepartmentMutation = gql`mutation chooseDepartment($brandId: String!, $department: String!) {
  authorization {
    chooseDepartment(brandId: $brandId, department: $department) {
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
}`;

export {
  signInMutation,
  chooseDepartmentMutation,
};
