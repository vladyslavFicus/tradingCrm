import gql from 'graphql-tag';

const freeSpinQuery = gql`query freeSpin($playerUUID: String!, $uuid: String!){
  freeSpin(playerUUID: $playerUUID, uuid: $uuid){
    data {
      _id
      uuid
      name
      authorUUID
      freeSpinTemplateUUID
      freeSpinTemplateUUID
      bonusTemplateUUID
      providerId
      gameName
      gameId
      status
      reason
      error
      statusChangedDate
      freeSpinStatus
      startDate
      statusChangedAuthorUUID
      startDate
      endDate
      freeSpinsAmount
      playedCount
      currencyCode
      winning {
        amount
        currency
      }
      prize {
        amount
        currency
      }
      capping {
        amount
        currency
      }
      linesPerSpin      
      betPrice
      coinSize
      betMultiplier
      rhfpBet
      bonus {
        bonusLifeTime
        prizePercentage
        prizeAbsolute {
          amount
          currency
        }
        cappingPercentage
        cappingAbsolute {
          amount
          currency
        }
        grantRatioPercentage
        grantRatioAbsolute {
          amount
          currency
        }
        maxGrantAmount {
          amount
          currency
        }
        wageringRequirementAbsolute {
          amount
          currency
        }
        wageringRequirementPercentage
        wageringRequirementType
        moneyTypePriority
        maxBet {
          amount
          currency
        }
        bonusLifeTime
        lockAmountStrategy
        claimable
      }
    }
    error {
      error
    }
  }
}`;

export {
  freeSpinQuery,
};
