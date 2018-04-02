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
      creationDate
    }
  }
}`;

export {
  campaignsQuery,
  campaignQuery,
};
