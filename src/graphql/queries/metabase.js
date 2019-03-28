import gql from 'graphql-tag';

const getMetabaseTokenQuery = gql`query getMetabaseTokenQuery($agent_id: String) {
  getMetabaseToken(agent_id: $agent_id) {
    token
  }
}`;

export {
  getMetabaseTokenQuery,
};
