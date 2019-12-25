import gql from 'graphql-tag';
import { RisksQuestionnaireFragment } from 'graphql/fragments/risksQuestionnaire';

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
  risksQuestionnaireQuery,
};
