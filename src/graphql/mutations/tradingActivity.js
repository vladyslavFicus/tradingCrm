import { gql } from '@apollo/client';

const changeOriginalAgent = gql`
  mutation changeOriginalAgent(
    $tradeId: Int!
    $agentId: String!
  ) {
    tradingActivity {
      changeOriginalAgent(
        tradeId: $tradeId
        agentId: $agentId
      )
    }
  }
`;

export { changeOriginalAgent };
