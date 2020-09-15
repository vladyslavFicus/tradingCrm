import gql from 'graphql-tag';

const unlockLoginMutation = gql`mutation unlockLogin($uuid: String!) {
  auth {
    unlockLogin(uuid: $uuid)
  }
}`;

export {
  unlockLoginMutation,
};
