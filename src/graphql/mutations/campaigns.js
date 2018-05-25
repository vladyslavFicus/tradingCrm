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
  $countries: [String]
  $excludeCountries: Boolean
  $targetType: String!
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
      countries: $countries
      excludeCountries: $excludeCountries
      targetType: $targetType
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
        targetType
        countries
        excludeCountries
      }
      error {
        error
      }
    }
  }
}`;

const createMutation = gql`mutation create(
  $name: String!,
  $targetType: String!,
  $optIn: Boolean!,
  $fulfillments: [String]!,
  $rewards: [String]!
  $startDate: String
  $endDate: String
) {
  campaign {
    create(
      name: $name
      targetType: $targetType
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
  $claimable: Boolean
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
    claimable: $claimable
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

const removeAllPlayersMutation = gql`mutation removeAllPlayers(
  $campaignUUID: String!,
) {
  campaign {
    removeAllPlayers(
      campaignUUID: $campaignUUID
      ) {
      data {
        uuid
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
  freeSpinTemplateMutation,
  updateMutation,
  createMutation,
  removeAllPlayersMutation,
};
