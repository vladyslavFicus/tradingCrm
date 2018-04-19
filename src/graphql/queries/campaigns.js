import gql from 'graphql-tag';

const campaignsQuery = gql`query campaigns(
  $size: Int,
  $page: Int,
  ){
  campaigns(
    size: $size,
    page: $page,
    ){
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
      state
      excludeCountries
      authorUUID
      creationDate
      startDate
      endDate
      rewards {
        type
        uuid
      }
      fulfillments
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
  }
}`;

const freeSpinTemplateQuery = gql`query freeSpinTemplate($uuid: String!, $aggregatorId: String!) {
  freeSpinTemplate(uuid: $uuid, aggregatorId: $aggregatorId) {
    data {
      aggregatorId
      name
      uuid
      gameId
      providerId
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
    }
    error {
      error
    }
  }
}`;

const freeSpinTemplateOptionsQuery = gql`query freeSpinOptions {
  freeSpinOptions
}`;

const wageringQuery = gql`query wagering($uuid: String!) {
  wagering(uuid: $uuid) {
    data {
      uuid
      amounts {
        amount,
        currency
      }
    }
    error {
      error
    }
  }
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
  wageringQuery,
  depositFulfillmentQuery,
};
