import gql from 'graphql-tag';

const leadCsvUpload = gql`mutation singleFileUpload(
  $file: Upload!,
) {
  upload {
    leadCsvUpload (
      file: $file, 
    ) {
      error {
        error
        fields_errors
      }
      success
    }
  }
}`;

export {
  leadCsvUpload,
};
