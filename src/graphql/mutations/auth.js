import { gql } from '@apollo/client';

const unlockLoginMutation = gql`mutation unlockLogin($uuid: String!) {
  auth {
    unlockLogin(uuid: $uuid)
  }
}`;

export {
  unlockLoginMutation,
};
