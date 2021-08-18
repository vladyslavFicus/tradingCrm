import gql from 'graphql-tag';

export default gql`query TradingEngine_AccountQuery($identifier: String!) {
  tradingEngineAccount (
    identifier: $identifier
  ) {
    uuid
    name
    login
    group
    credit
    enable
    profileUuid
    profileFullName
    registrationDate
    leverage
    balance
    accountType
  }
}
`;
