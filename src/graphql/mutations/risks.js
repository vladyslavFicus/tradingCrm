import gql from 'graphql-tag';
import { RisksQuestionnaireFragment } from 'graphql/fragments/risksQuestionnaire';

const calculateRiskMutation = gql`
  mutation calculateRiskMutation (
    $playerUuid: String!
    $questionnaireId: Int!
    $answers: [RiskAnswersInputType]
  ) {
    risks {
      calculateRisk(
        playerUuid: $playerUuid,
        questionnaireId: $questionnaireId
        answers: $answers
      ) {
        data {
          ...RisksQuestionnaireFragment
        }
        error {
          error
          fields_errors
        }
      }
    }
  }
  ${RisksQuestionnaireFragment}
`;

const saveRiskDataMutation = gql`
  mutation saveRiskDataMutation (
    $playerUuid: String!
    $questionnaireId: Int!
    $answers: [RiskAnswersInputType]
  ) {
    risks {
      saveRiskData(
        playerUuid: $playerUuid,
        questionnaireId: $questionnaireId
        answers: $answers
      ) {
        data {
          ...RisksQuestionnaireFragment
        }
        error {
          error
          fields_errors
        }
      }
    }
  }
  ${RisksQuestionnaireFragment}
`;

export {
  calculateRiskMutation,
  saveRiskDataMutation,
};
