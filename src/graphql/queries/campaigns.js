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


export {
  freeSpinTemplatesQuery,
  freeSpinTemplateQuery,
  campaignsQuery,
  campaignQuery,
  shortBonusTemplatesQuery,
  bonusTemplateQuery,
};
