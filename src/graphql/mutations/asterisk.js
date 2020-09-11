import gql from 'graphql-tag';

const createCall = gql`
  mutation AsteriskCreateCall($uuid: String!, $field: String!, $type: String!, $prefix: Int!) {
    clickToCall {
      asterisk {
        createCall(uuid: $uuid, field: $field, type: $type, prefix: $prefix)
      }
    }
  }
`;

export {
  createCall,
};
