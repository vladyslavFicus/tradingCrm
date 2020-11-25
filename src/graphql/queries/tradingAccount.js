import gql from 'graphql-tag';

const getClientTradingAccounts = gql`
  query getClientTradingAccounts(
    $profileUUID: String!
    $accountType: String
    $platformType: String
  ) {
    clientTradingAccounts(
      profileUUID: $profileUUID,
      accountType: $accountType
      platformType: $platformType
    ) {
      accountUUID
      currency
      balance
      credit
      margin
      name
      login
      group
      accountType
      platformType
      archived
      leverage
      readOnlyUpdateTime
      readOnlyUpdatedBy
      readOnly
      profileUUID
      operator {
        fullName
      }
      lastLeverageChangeRequest {
        changeLeverageFrom
        changeLeverageTo
        status
        createDate
      }
    }
  }
`;

export { getClientTradingAccounts };
