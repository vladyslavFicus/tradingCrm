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
  $uuid: String!
  $name: String!
  $optIn: Boolean!
  $fulfillments: [String]!
  $rewards: [String]!
  $startDate: String
  $endDate: String
) {
  campaign {
    update(
      uuid: $uuid
      name: $name
      optIn: $optIn
      fulfillments: $fulfillments
      rewards: $rewards
      startDate: $startDate
      endDate: $endDate
    ) {
      data {
        _id
        name
        optIn
        rewards {
          type
          uuid
        }
        fulfillments
        startDate
        endDate
      }
      error {
        error
      }
    }
  }
}`;

const createMutation = gql`mutation create(
  $name: String!,
  $optIn: Boolean!,
  $fulfillments: [String]!,
  $rewards: [String]!
  $startDate: String
  $endDate: String
) {
  campaign {
    create(
      name: $name
      optIn: $optIn
      fulfillments: $fulfillments
      rewards: $rewards
      startDate: $startDate
      endDate: $endDate
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
  $internalGameId: String!
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
  $denomination: Float
  $coins: Int
  $bonusTemplateUUID: String
  $displayLine1: String
  $displayLine2: String
  $nearestCost: Float
  $moduleId: String
  $clientId: String
  ) {
  freeSpinTemplate {
    add (
    name: $name,
    aggregatorId: $aggregatorId,
    providerId: $providerId,
    gameId: $gameId,
    comment: $comment,
    internalGameId: $internalGameId,
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
    displayLine1: $displayLine1
    displayLine2:  $displayLine2
    nearestCost: $nearestCost
    clientId:  $clientId
    moduleId: $moduleId
    denomination: $denomination
    coins: $coins
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
