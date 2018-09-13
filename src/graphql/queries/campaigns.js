import gql from 'graphql-tag';

const campaignsQuery = gql`query campaigns(
  $size: Int,
  $page: Int,
  $searchBy: String,
  $status: String,
  $fulfilmentType: String,
  $targetType: String,
  $optIn: Boolean,
  $creationDateFrom: String,
  $creationDateTo: String,
  $activityDateFrom: String,
  $activityDateTo: String
){
  campaigns(
    size: $size,
    page: $page,
    searchBy: $searchBy,
    status: $status,
    fulfilmentType: $fulfilmentType,
    targetType: $targetType,
    optIn: $optIn,
    creationDateFrom: $creationDateFrom,
    creationDateTo: $creationDateTo,
    activityDateFrom: $activityDateFrom,
    activityDateTo: $activityDateTo
  ) {
    number,
    page,
    totalElements,
    size,
    last,
    content {
      _id
      uuid
      name
      state
      authorUUID
      creationDate
      startDate
      endDate
    }
  }
}`;

const campaignQuery = gql`query campaign($campaignUUID: String!){
  campaign(campaignUUID: $campaignUUID){
    data {
      _id
      uuid
      name
      targetType
      optIn
      state
      excludeCountries
      authorUUID
      creationDate
      startDate
      endDate
      optInPeriod
      optInPeriodTimeUnit
      fulfillmentPeriod
      fulfillmentPeriodTimeUnit
      promoCode
      rewards
      fulfillments
      countries
      excludeCountries
    }
    error {
      error
    }
  }
}`;

const freeSpinTemplatesQuery = gql`query freeSpinTemplates {
  freeSpinTemplates {
    aggregatorId
    name
    uuid
    providerId
    status
  }
}`;

const shortBonusTemplatesQuery = gql`query shortBonusTemplates {
  shortBonusTemplates {
    name
    uuid
  }
}`;

const bonusTemplateQuery = gql`query bonusTemplate($uuid: String!) {
  bonusTemplate(uuid: $uuid) {
    data {
     name
     uuid
     moneyTypePriority
     claimable
     lockAmountStrategy
     bonusLifeTime
     prizePercentage
     prizeAbsolute {
      amount
      currency
     }
     maxGrantAmount {
      amount
      currency
     }
     cappingPercentage
     cappingAbsolute {
      amount
      currency
     }
     grantRatioPercentage
     grantRatioAbsolute{
      amount
      currency
     },
     maxBet{
      amount,
      currency,
     },
     wageringRequirementType,
     wageringRequirementPercentage,
     wageringRequirementAbsolute{
      amount,
      currency,
     }
    }
    error {
      error
    }
  }
}`;

const freeSpinTemplateQuery = gql`query freeSpinTemplate($uuid: String!, $aggregatorId: String!) {
  freeSpinTemplate(uuid: $uuid, aggregatorId: $aggregatorId) {
    data {
      aggregatorId
      name
      uuid
      gameId
      denomination
      coins
      internalGameId
      supportedGames {
        data {
          fullGameName
          gameId
          internalGameId
        }
        error {
          error
        }
      }
      providerId
      game {
        data {
          fullGameName
        }
        error {
          error
        }
      }
      freeSpinLifeTime
      coinSize
      linesPerSpin
      betMultiplier
      bonusTemplateUUID
      rhfpBet
      comment
      freeSpinsAmount
      betLevel
      pageCode
      status
      displayLine1
      displayLine2
      nearestCost
      claimable
      betPerLineAmounts {
        amount
        currency
      }
    }
    error {
      error
    }
  }
}`;

const freeSpinTemplateOptionsQuery = gql`query freeSpinOptions {
  freeSpinOptions
}`;

const depositFulfillmentQuery = gql`query depositFulfillment($uuid: String!) {
  depositFulfillment(uuid: $uuid) {
    data {
      uuid
      numDeposit
      minAmount {
        amount
        currency
      }
      maxAmount {
        amount
        currency
      }
      excludedPaymentMethods
    }
    error {
      error
    }
  }
}`;

export {
  freeSpinTemplatesQuery,
  freeSpinTemplateQuery,
  campaignsQuery,
  campaignQuery,
  shortBonusTemplatesQuery,
  bonusTemplateQuery,
  freeSpinTemplateOptionsQuery,
  depositFulfillmentQuery,
};
