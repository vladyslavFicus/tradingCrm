import gql from 'graphql-tag';

const MUTATION = gql`
  mutation TokenRefreshMutation {
    auth {
      tokenRenew {
        token
      }
    }
  }
`;

/**
 * Token refresh handler for auth link
 *
 * @param storage Storage instance
 *
 * @return {Promise<any>}
 */
export default storage => async (client) => {
  try {
    // Execute token renew mutation to receive new token
    const { data: { auth: { tokenRenew: { token } } } } = await client.mutate({
      mutation: MUTATION,
    });

    storage.set('token', token);

    return token;
  } catch (e) {
    return null;
  }
};
