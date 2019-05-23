import gql from 'graphql-tag';

const changeStatusMutation = gql`mutation QuestionnaireChangeStatus (
  $questionnaireUUID: String!
  $status: String!
) {
  questionnaire {
    changeStatus(questionnaireUUID: $questionnaireUUID, status: $status) {
      success
    }
  }
}`;

export {
  changeStatusMutation,
};
