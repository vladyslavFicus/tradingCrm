import gql from 'graphql-tag';

const updateSubscription = gql`mutation updateSubscription(
    $playerUUID: String!,
    $marketingMail: Boolean!,
    $marketingSMS: Boolean!,
    $tailorMadeEmail: Boolean!,
    $tailorMadeSMS: Boolean!
) {
  profile {
    updateSubscription(
      playerUUID: $playerUUID,
      marketingSMS: $marketingSMS,
      marketingMail: $marketingMail,
      tailorMadeEmail: $tailorMadeEmail,
      tailorMadeSMS: $tailorMadeSMS
      ) {
      data {
        playerUUID
        marketingMail
        marketingSMS
        tailorMadeEmail
        tailorMadeSMS
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
  $duration: SuspendDuration,
  $permanent: Boolean,
  $comment: String
) {
  profile {
    suspendProlong(
      playerUUID: $playerUUID,
      reason: $reason,
      duration: $duration,
      permanent: $permanent,
      comment: $comment
      ) {
      data {
        playerUUID
        profileStatus
        profileStatusAuthor
        profileStatusPermanent
        profileStatusReason
        profileStatusDate
        profileStatusComment
        suspendEndDate
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
  $duration: SuspendDuration,
  $permanent: Boolean,
  $comment: String
){
  profile {
    suspend(
      playerUUID: $playerUUID,
      reason: $reason,
      duration: $duration,
      permanent: $permanent,
      comment: $comment
      ) {
      data {
        playerUUID
        profileStatus
        profileStatusAuthor
        profileStatusPermanent
        profileStatusReason
        profileStatusDate
        profileStatusComment
        suspendEndDate
      }
      error {
        error
      }
    }
  }
}`;

const clientsBulkRepresentativeUpdate = gql`mutation bulkRepresentativeUpdate(
  $teamId: String,
  $salesRep: [String]
  $retentionRep: [String],
  $salesStatus: String,
  $retentionStatus: String,
  $type: String!,
  $isMoveAction: Boolean,
  $allRowsSelected: Boolean,
  $clients: [ClientBulkUpdateType],
  $totalElements: Int,
  $searchParams: ClientSearchParams,
) {
  clients {
    bulkRepresentativeUpdate (
      teamId: $teamId,
      salesRep: $salesRep
      retentionRep: $retentionRep,
      salesStatus: $salesStatus,
      retentionStatus: $retentionStatus,
      type: $type,
      isMoveAction: $isMoveAction,
      allRowsSelected: $allRowsSelected,
      clients: $clients,
      totalElements: $totalElements,
      searchParams: $searchParams,
    ) {
      data
      error {
        error
        fields_errors
      }
    }
  }
}`;

const updateMutation = gql`mutation update(
  $playerUUID: String!,
  $phone1: String,
  $phone2: String,
  $languageCode: String,
  $passportNumber: String,
  $expirationDate: String,
  $countryOfIssue: String,
  $passportIssueDate: String,
  $kycStatus: String,
  $countrySpecificIdentifier: String,
  $countrySpecificIdentifierType: String,
){
  profile {
    update(
      playerUUID: $playerUUID,
      phone1: $phone1,
      phone2: $phone2,
      languageCode: $languageCode,
      passportNumber: $passportNumber,
      expirationDate: $expirationDate,
      countryOfIssue: $countryOfIssue,
      passportIssueDate: $passportIssueDate,
      kycStatus: $kycStatus,
      countrySpecificIdentifier: $countrySpecificIdentifier,
      countrySpecificIdentifierType: $countrySpecificIdentifierType,
    ) {
      data {
        playerUUID
        tradingProfile {
          phone1
          phone2
          languageCode
          kycStatus
          passport {
            passportNumber
            expirationDate
            countryOfIssue
            passportIssueDate
          }
          countrySpecificIdentifier
          countrySpecificIdentifierType
        }
      }
      error {
        error
      }
    }
  }
}`;

const updateLimitProfileMutation = gql`mutation update(
  $profileId: String!,
  $phone2: String,
  $email2: String
){
  profile {
    limitedUpdate(
      profileId: $profileId,
      phone2: $phone2,
      email2: $email2
    ) {
      success
    }
  }
}`;

const clickToCall = gql`mutation clickToCall($agent: String!, $number: String!) {
  profile {
    clickToCall(agent: $agent, number: $number) {
      success
    }
  }
}`;

const updateFATCA = gql`mutation updateFATCA($profileId: String!, $fatca: FATCAInput) {
  profile {
    updateFATCA(profileId: $profileId, fatca: $fatca) {
      success
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
  clientsBulkRepresentativeUpdate,
  updateMutation,
  clickToCall,
  updateFATCA,
  updateLimitProfileMutation,
};
