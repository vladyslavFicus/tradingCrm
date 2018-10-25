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
  $rewards: [InputReward]!
  $startDate: String
  $endDate: String
  $countries: [String]
  $excludeCountries: Boolean
  $targetType: String!
  $optInPeriod: Int
  $optInPeriodTimeUnit: String
  $fulfillmentPeriod: Int
  $fulfillmentPeriodTimeUnit: String
  $promoCode: String
  $tags: [String]
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
      optInPeriod: $optInPeriod
      optInPeriodTimeUnit: $optInPeriodTimeUnit
      fulfillmentPeriod: $fulfillmentPeriod
      fulfillmentPeriodTimeUnit: $fulfillmentPeriodTimeUnit
      promoCode: $promoCode
      tags: $tags
    ) {
      data {
        _id
        name
        optIn
        rewards
        fulfillments
        startDate
        endDate
        targetType
        countries
        excludeCountries
        optInPeriod
        optInPeriodTimeUnit
        promoCode
        tags {
          tagId
          tagName
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const createMutation = gql`mutation create(
  $name: String!
  $targetType: String!
  $optIn: Boolean!
  $fulfillments: [String]!
  $rewards: [InputReward]!
  $startDate: String
  $endDate: String
  $countries: [String]
  $optInPeriod: Int
  $optInPeriodTimeUnit: String
  $fulfillmentPeriod: Int
  $fulfillmentPeriodTimeUnit: String
  $promoCode: String
  $tags: [String]
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
      countries: $countries
      optInPeriod: $optInPeriod
      optInPeriodTimeUnit: $optInPeriodTimeUnit
      fulfillmentPeriod: $fulfillmentPeriod
      fulfillmentPeriodTimeUnit: $fulfillmentPeriodTimeUnit
      promoCode: $promoCode
      tags: $tags
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
  $moneyType: String
  $betMultiplier: Int
  $coinSize: Float
  $freeSpinLifeTime: Int!
  $freeSpinsAmount: Int!
  $linesPerSpin: Int
  $rhfpBet: Int
  $pageCode: String
  $betLevel: Int
  $betPerLineAmounts: [InputMoney]
  $supportedGames: [InputGame]
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
    moneyType: $moneyType,
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
    supportedGames: $supportedGames
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

const fullResetCampaignMutation = gql`mutation fullResetCampaign(
  $campaignUUID: String!,
) {
  campaign {
    fullResetCampaign(
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

const cloneMutation = gql`mutation clone($uuid: String!) {
  campaign {
    clone(uuid: $uuid) {
      data {
        uuid
      }
      error {
        error
      }
    }
  }
}`;

const resetPlayerMutation = gql`mutation resetPlayer(
  $campaignUUID: String!,
  $playerUUID: String!,
) {
  campaign {
    resetPlayer(
      campaignUUID: $campaignUUID
      playerUUID: $playerUUID
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
  cloneMutation,
  resetPlayerMutation,
  fullResetCampaignMutation,
};
