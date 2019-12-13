import gql from 'graphql-tag';

const ProfileStatusFragment = gql`fragment ProfileStatusFragment on ProfileStatusType {
  changedAt
  changedBy
  comment
  reason
  type
}`;

export {
  ProfileStatusFragment,
};
