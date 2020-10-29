import gql from 'graphql-tag';

const createCall = gql`
  mutation DidLogicCreateCall($uuid: String!, $field: String!, $type: String!) {
    clickToCall {
      didlogic {
        createCall(uuid: $uuid, field: $field, type: $type)
      }
    }
  }
`;

export {
  createCall,
};
