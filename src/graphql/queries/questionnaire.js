import gql from 'graphql-tag';

const questionnaireLasDataQuery = gql`query getLastQuestionnaireData($profileUUID: String!) {
  questionnaire {
    lastProfileData(profileUUID: $profileUUID) {
      data {
        uuid
        status
        score
        version
        reviewedBy
        updatedAt
      } error {
        error
      }
    }
  }
}`;

export {
  questionnaireLasDataQuery,
};
