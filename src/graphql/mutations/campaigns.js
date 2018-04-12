import gql from 'graphql-tag';

const activateMutation = gql`mutation activate(
  $campaignUUID: String!,
) {
  campaign {
    activate(
      campaignUUID: $campaignUUID
      ) {
      data {
        _id,
        name,
        state
      }
      error {
        error
      }
    }
  }
}`;

const cancelMutation = gql`mutation cancel(
  $campaignUUID: String!,
  $reason: String!,
) {
  campaign {
    cancel(
      campaignUUID: $campaignUUID,
      reason: $reason
      ) {
      data {
        _id,
        name,
        state
      }
      error {
        error
      }
    }
  }
}`;

const updateMutation = gql`mutation update(
  $uuid: String!,
  $name: String!,
  $fulfillments: [String]!,
  $rewards: [String]!
) {
  campaign {
    update(
      uuid: $uuid,
      name: $name,
      fulfillments: $fulfillments,
      rewards: $rewards, 
    ) {
      data {
        _id,
        name,
        fulfillments,
        rewards,
      }
      error {
        error
      }
    }
  }
}`;

export {
  activateMutation,
  cancelMutation,
  updateMutation,
};
