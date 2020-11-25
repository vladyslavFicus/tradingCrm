import gql from 'graphql-tag';

// # TODO: Remove after operators list will be refactored
const authoritiesOptionsQuery = gql`query authoritiesOptions {
  authoritiesOptions
}`;

export {
  authoritiesOptionsQuery,
};
