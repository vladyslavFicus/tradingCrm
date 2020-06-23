import gql from 'graphql-tag';

const ProfileStatusFragment = gql`fragment ProfileStatusFragment on Profile__Status {
  changedAt
  changedBy
  comment
  reason
  type
}`;

export {
  ProfileStatusFragment,
};
