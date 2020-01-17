import gql from 'graphql-tag';
import { RisksQuestionnaireFragment } from 'graphql/fragments/risksQuestionnaire';

const getRisksCategory = gql`
  query risksQuestionnaireQuery(
    $clientUuid: String!
  ) {
    riskQuestionnaire (
      clientUuid: $clientUuid
    ) {
      data {
        riskCategory
      }
      error {
        error
      }
    }
  }
`;

const risksQuestionnaireQuery = gql`
  query risksQuestionnaireQuery(
    $clientUuid: String!
  ) {
    riskQuestionnaire (
      clientUuid: $clientUuid
    ) {
      data {
        ...RisksQuestionnaireFragment
      }
      error {
        error
      }
    }
  }
  ${RisksQuestionnaireFragment}
`;

export {
  getRisksCategory,
  risksQuestionnaireQuery,
};
