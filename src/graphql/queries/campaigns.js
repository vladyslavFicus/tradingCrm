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

export {
  campaignsQuery,
  campaignQuery,
};
