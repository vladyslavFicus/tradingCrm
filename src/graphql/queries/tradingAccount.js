import gql from 'graphql-tag';

const getTradingAccount = gql`query getTradingAccount($uuid: String!, $accountType: String) {
    tradingAccount(uuid: $uuid, accountType: $accountType) {
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
  }`;

export {
  getTradingAccount,
};
