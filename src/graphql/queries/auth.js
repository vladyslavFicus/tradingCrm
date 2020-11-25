import { gql } from '@apollo/client';

// # TODO: Remove after operators list will be refactored
const authoritiesOptionsQuery = gql`query authoritiesOptions {
  authoritiesOptions
}`;

export {
  authoritiesOptionsQuery,
};
