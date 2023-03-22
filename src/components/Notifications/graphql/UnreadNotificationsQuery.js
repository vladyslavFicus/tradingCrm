import { gql } from '@apollo/client';

export const UnreadNotificationsQuery = gql`
  query UnreadNotificationsQuery {
    notificationCenterUnread
  }
`;
