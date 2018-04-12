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
        _id
        name
        bonusTemplateUuids
        wageringUuids
        freeSpinTemplateUuids
      }
      error {
        error
      }
    }
  }
}`;

const createMutation = gql`mutation create(
  $name: String!,
  $fulfillments: [String]!,
  $rewards: [String]!
) {
  campaign {
    create(
      name: $name,
      fulfillments: $fulfillments,
      rewards: $rewards,
    ) {
      data {
        _id
        uuid
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const freeSpinTemplateMutation = gql`mutation freeSpinTemplateMutation(
  $name: String!,
  $aggregatorId: String!
  $providerId: String!
  $gameId: String!
  $comment: String
  $betMultiplier: Int
  $coinSize: Int
  $freeSpinLifeTime: Int!
  $freeSpinsAmount: Int!
  $linesPerSpin: Int
  $rhfpBet: Int
  $pageCode: String
  $betLevel: Int
  $betPerLineAmounts: [InputMoney]
  $bonusTemplateUUID: String
  ) {
  freeSpinTemplate {
    add (
    name: $name,
    aggregatorId: $aggregatorId,
    providerId: $providerId,
    gameId: $gameId,
    comment: $comment,
    betMultiplier: $betMultiplier,
    coinSize: $coinSize,
    freeSpinLifeTime: $freeSpinLifeTime,
    freeSpinsAmount: $freeSpinsAmount,
    linesPerSpin: $linesPerSpin,
    rhfpBet: $rhfpBet,
    betLevel: $betLevel,
    betPerLineAmounts: $betPerLineAmounts
    bonusTemplateUUID: $bonusTemplateUUID
    pageCode: $pageCode
    ) {
      data {
        aggregatorId
        providerId
        name
        status
        uuid
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

export {
  activateMutation,
  cancelMutation,
  freeSpinTemplateMutation,
  updateMutation,
  createMutation,
};
