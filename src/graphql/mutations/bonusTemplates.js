import gql from 'graphql-tag';

const addBonusMutation = gql`mutation addBonus(
  $name: String!,
  $bonusLifeTime: Float!,
  $moneyTypePriority: String!,
  $claimable: Boolean,
  $lockAmountStrategy: String!,
  
  $maxBet: [InputMoney],
  $maxGrantAmount: [InputMoney],
  
  $prizeAbsolute: [InputMoney],
  $prizePercentage: Float,

  $cappingAbsolute: [InputMoney],
  $cappingPercentage: Float,
  
  $grantRatioAbsolute: [InputMoney],
  $grantRatioPercentage: Float,

  $wageringRequirementType: String,
  $wageringRequirementAbsolute: [InputMoney],
  $wageringRequirementPercentage: Float,
) {
  bonusTemplate {
    add(
      name: $name,
      bonusLifeTime: $bonusLifeTime,
      moneyTypePriority: $moneyTypePriority,
      claimable: $claimable,
      maxBet: $maxBet,
      lockAmountStrategy: $lockAmountStrategy,
      maxGrantAmount: $maxGrantAmount,
      
      prizeAbsolute: $prizeAbsolute,
      prizePercentage: $prizePercentage,
      
      cappingAbsolute: $cappingAbsolute,
      cappingPercentage: $cappingPercentage,
      
      grantRatioAbsolute: $grantRatioAbsolute,
      grantRatioPercentage: $grantRatioPercentage,
      
      wageringRequirementType: $wageringRequirementType,
      wageringRequirementAbsolute: $wageringRequirementAbsolute,
      wageringRequirementPercentage: $wageringRequirementPercentage,
      ) {
      data {
        uuid
      }
      error {
        error
      }
    }
  }
}`;

export {
  addBonusMutation,
};
