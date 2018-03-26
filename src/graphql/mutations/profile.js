import gql from 'graphql-tag';

const updateSubscription = gql`mutation updateSubscription(
    $playerUUID: String!,
    $marketingMail: Boolean!,
    $marketingNews: Boolean!,
    $marketingSMS: Boolean!
) {
  profile {
    updateSubscription(
      playerUUID: $playerUUID,
      marketingNews: $marketingNews,
      marketingSMS: $marketingSMS,
      marketingMail: $marketingMail
      ) {
      data {
        marketingMail
        marketingNews
        marketingSMS
      }
      error {
        error
      }
    }
  }
}`;

const blockMutation = gql`mutation block(
  $playerUUID: String!,
  $reason: String!,
  $comment: String
) {
  profile {
    block(
      playerUUID: $playerUUID,
      reason: $reason,
      comment: $comment
      ) {
      data {
        playerUUID
        profileStatus
        profileStatusReason
        profileStatusDate
      }
      error {
        error
      }
    }
  }
}`;

const unblockMutation = gql`mutation unblock(
  $playerUUID: String!,
  $reason: String!,
  $comment: String
) {
  profile {
    unblock(
      playerUUID: $playerUUID,
      reason: $reason,
      comment: $comment
      ) {
      data {
        playerUUID
        profileStatus
        profileStatusReason
        profileStatusDate
      }
      error {
        error
      }
    }
  }
}`;

const resumeMutation = gql`mutation resume(
  $playerUUID: String!,
  $reason: String!,
  $comment: String,
) {
  profile {
    resume(
      playerUUID: $playerUUID,
      reason: $reason,
      comment: $comment
      ) {
      data {
        playerUUID
        profileStatus
        profileStatusReason
        profileStatusDate
      }
      error {
        error
      }
    }
  }
}`;

const suspendProlong = gql`mutation suspendProlong(
  $playerUUID: String!,
  $reason: String!,
  $durationAmount: String!,
  $durationUnit: String!,
  $comment: String
) {
  profile {
    suspendProlong(
      playerUUID: $playerUUID,
      reason: $reason,
      durationAmount: $durationAmount,
      durationUnit: $durationUnit,
      comment: $comment
      ) {
      data {
        playerUUID
        profileStatus
        profileStatusReason
        profileStatusDate
      }
      error {
        error
      }
    }
  }
}`;

const passwordResetRequest = gql`mutation passwordResetRequest($brandId: String!, $playerUUID: String!) {
  profile {
    passwordResetRequest(playerUUID: $playerUUID, brandId: $brandId) {
      success
    }
  }
}`;

const changePassword = gql`mutation changePassword($playerUUID: String!, $password: String!) {
  profile {
    changePassword(playerUUID: $playerUUID, password: $password) {
      success
    }
  }
}`;

const suspendMutation = gql`mutation suspend(
  $playerUUID: String!,
  $reason: String!,
  $durationAmount: String!,
  $durationUnit: String!,
  $comment: String
){
  profile {
    suspend(
      playerUUID: $playerUUID,
      reason: $reason,
      durationAmount: $durationAmount,
      durationUnit: $durationUnit,
      comment: $comment
      ) {
      data {
        playerUUID
        profileStatus
        profileStatusReason
        profileStatusDate
      }
      error {
        error
      }
    }
  }
}`;

export {
  updateSubscription,
  blockMutation,
  unblockMutation,
  suspendProlong,
  suspendMutation,
  resumeMutation,
  passwordResetRequest,
  changePassword,
};
