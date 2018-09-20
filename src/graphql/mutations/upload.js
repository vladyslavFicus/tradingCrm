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
      data {
        leads {
          id
          brandId
          name
          surname
          phone
          mobile
          status
          email
          country
          source
          salesAgent
          salesStatus
          birthDate
          affiliate
          gender
          city
          language
        }
      }
    }
  }
}`;

export {
  leadCsvUpload,
};
