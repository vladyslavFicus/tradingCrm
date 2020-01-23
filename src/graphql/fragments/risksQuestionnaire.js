import gql from 'graphql-tag';

const RisksQuestionnaireFragment = gql`
  fragment RisksQuestionnaireFragment on RisksType {
    uuid
    playerUuid
    brandId
    totalScore
    riskCategory
    createdAt
    createdBy
    questionnaire {
      id
      questionGroups {
        id
        title
        score
        questionSubGroups {
          id
          title
          questions {
            id
            type
            title
            answers {
              id
              title
              selected
            }
          }
        }
      }
    }
    disabledQuestions {
      questionId
      answerId
      disabledQuestions
    }
  }
`;

export {
  RisksQuestionnaireFragment,
};
