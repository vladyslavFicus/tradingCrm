import gql from 'graphql-tag';

const campaignsQuery = gql`query campaigns{
  campaigns{
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
      bonuses {
        name,
        moneyTypePriority,
        claimable,
        uuid,
        lockAmountStrategy,
        bonusLifeTime,
        brandId,
      },
      freeSpins {
        aggregatorId,
        bonusTemplateUUID,
        brandId,
        gameId,
        name,
        pageCode,
        status,
        uuid,
        betLevel,
        freeSpinLifeTime,
        freeSpinsAmount,
      }
    }
  }
}`;

export {
  campaignsQuery,
  campaignQuery,
};
