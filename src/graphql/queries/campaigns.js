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
      _id,
      uuid,
      name,
      state,
      authorUUID,
      creationDate
    }
  }
}`;

const campaignQuery = gql`query campaign($campaignUUID: String!){
  campaign(campaignUUID: $campaignUUID){
    data {
      _id,
      uuid,
      name,
      state,
      excludeCountries,
      authorUUID,
      creationDate,
      rewards,
      wageringFulfillments,
      freeSpinTemplateUuids,
      bonusTemplateUuids,
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
     uuid,
     moneyTypePriority,
     claimable,
     lockAmountStrategy,
     bonusLifeTime
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

const freeSpinTemplateOptionsQuery = gql`query freeSpinOptions {
  freeSpinOptions
}`;


export {
  freeSpinTemplatesQuery,
  freeSpinTemplateQuery,
  campaignsQuery,
  campaignQuery,
  shortBonusTemplatesQuery,
  bonusTemplateQuery,
  freeSpinTemplateOptionsQuery,
  freeSpinTemplateMutation,
};
