import gql from 'graphql-tag';

const permissionsQuery = gql`query getPermission {
  permission {
    data
  }
}`;

const authoritiesOptionsQuery = gql`query authoritiesOptions {
  authoritiesOptions {
    data {
      delete {
        departmentRole
      }
      post {
        departmentRole
      }
    }
  }
}`;

export {
  permissionsQuery,
  authoritiesOptionsQuery,
};
