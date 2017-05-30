import PropTypes from 'prop-types';
import { types as limitTypes } from '../constants/limits';

PropTypes.price = PropTypes.shape({
  amount: PropTypes.number,
  currency: PropTypes.string,
});
PropTypes.status = PropTypes.shape({
  author: PropTypes.string,
  comment: PropTypes.string,
  editDate: PropTypes.string,
  reason: PropTypes.string,
  value: PropTypes.string,
});
PropTypes.pageable = content => PropTypes.shape({
  first: PropTypes.bool.isRequired,
  last: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  numberOfElements: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  sort: PropTypes.arrayOf(PropTypes.shape({
    ascending: PropTypes.bool.isRequired,
    direction: PropTypes.string.isRequired,
    ignoreCase: PropTypes.bool.isRequired,
    nullHandling: PropTypes.string.isRequired,
    property: PropTypes.string.isRequired,
  })),
  totalElements: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  content: PropTypes.arrayOf(content).isRequired,
});
PropTypes.pageableState = content => PropTypes.shape({
  entities: PropTypes.pageable(content).isRequired,
  isLoading: PropTypes.bool.isRequired,
  receivedAt: PropTypes.number,
  error: PropTypes.object,
});
PropTypes.ipEntity = PropTypes.shape({
  agent: PropTypes.string.isRequired,
  signInDate: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  ipAddress: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
});
PropTypes.noteEntity = PropTypes.shape({
  content: PropTypes.string.isRequired,
  creationDate: PropTypes.string,
  creatorUUID: PropTypes.string.isRequired,
  lastEditionDate: PropTypes.string,
  lastEditorUUID: PropTypes.string.isRequired,
  pinned: PropTypes.bool.isRequired,
  playerUUID: PropTypes.string.isRequired,
  targetType: PropTypes.string.isRequired,
  targetUUID: PropTypes.string,
  uuid: PropTypes.string,
});
PropTypes.gamingActivityEntity = PropTypes.shape({
  betDate: PropTypes.string,
  bonusBetAmount: PropTypes.price,
  bonusWinAmount: PropTypes.price,
  gameId: PropTypes.string.isRequired,
  gameProviderId: PropTypes.string.isRequired,
  gameRoundId: PropTypes.string.isRequired,
  gameSessionId: PropTypes.string.isRequired,
  gameType: PropTypes.string.isRequired,
  playerUUID: PropTypes.string.isRequired,
  realBetAmount: PropTypes.price,
  realWinAmount: PropTypes.price,
  totalBetAmount: PropTypes.price,
  totalWinAmount: PropTypes.price,
  winDate: PropTypes.string,
});
PropTypes.limitEntity = PropTypes.shape({
  author: PropTypes.string.isRequired,
  creationDate: PropTypes.string.isRequired,
  expirationDate: PropTypes.any,
  period: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  playerUUID: PropTypes.string.isRequired,
  startDate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  status: PropTypes.string.isRequired,
  statusAuthor: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  value: PropTypes.shape({
    type: PropTypes.string.isRequired,
    limit: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    left: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    used: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
  }).isRequired,
});
PropTypes.bonusEntity = PropTypes.shape({
  amountToWage: PropTypes.price,
  balance: PropTypes.price,
  bonusLifetime: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  bonusType: PropTypes.string,
  bonusUUID: PropTypes.string,
  campaignUUID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  cancellerUUID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  cancellerReason: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  capping: PropTypes.price,
  createdDate: PropTypes.string,
  currency: PropTypes.string,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  expirationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  grantedAmount: PropTypes.price,
  id: PropTypes.number,
  label: PropTypes.string,
  operatorUUID: PropTypes.string,
  optIn: PropTypes.bool,
  playerUUID: PropTypes.string,
  priority: PropTypes.number,
  prize: PropTypes.price,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  state: PropTypes.string,
  wagered: PropTypes.price,
});
PropTypes.fileEntity = PropTypes.shape({
  author: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  playerUuid: PropTypes.string.isRequired,
  realName: PropTypes.string.isRequired,
  status: PropTypes.status.isRequired,
  type: PropTypes.string.isRequired,
  uploadDate: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
});
PropTypes.uploadingFile = PropTypes.shape({
  id: PropTypes.string.isRequired,
  uploading: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  fileUUID: PropTypes.string,
  error: PropTypes.string,
});
PropTypes.userProfile = PropTypes.shape({
  acceptedTermsId: PropTypes.number,
  address: PropTypes.string,
  addressKycMetaData: PropTypes.arrayOf(PropTypes.fileEntity),
  addressStatus: PropTypes.status,
  affiliateId: PropTypes.string,
  birthDate: PropTypes.string,
  btag: PropTypes.string,
  city: PropTypes.string,
  completed: PropTypes.bool,
  country: PropTypes.string,
  email: PropTypes.string,
  firstName: PropTypes.string,
  gender: PropTypes.string,
  id: PropTypes.number,
  identifier: PropTypes.any,
  kycCompleted: PropTypes.bool,
  kycStatus: PropTypes.string,
  kycStatusReason: PropTypes.string,
  languageCode: PropTypes.string,
  lastName: PropTypes.string,
  marketingMail: PropTypes.bool,
  marketingNews: PropTypes.bool,
  marketingSMS: PropTypes.bool,
  personalKycMetaData: PropTypes.arrayOf(PropTypes.fileEntity),
  personalStatus: PropTypes.status,
  phoneNumber: PropTypes.string,
  phoneNumberVerified: PropTypes.bool,
  postCode: PropTypes.string,
  profileStatus: PropTypes.string,
  profileStatusComment: PropTypes.any,
  profileStatusReason: PropTypes.string,
  profileTags: PropTypes.arrayOf(PropTypes.any),
  registrationDate: PropTypes.string,
  registrationIP: PropTypes.string,
  suspendEndDate: PropTypes.any,
  title: PropTypes.string,
  token: PropTypes.string,
  tokenExpirationDate: PropTypes.string,
  username: PropTypes.string,
  uuid: PropTypes.string,
});
PropTypes.authorityEntity = PropTypes.shape({
  id: PropTypes.number.isRequired,
  department: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
});
PropTypes.dropDownOption = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});
PropTypes.operatorProfile = PropTypes.shape({
  authorities: PropTypes.arrayOf(PropTypes.authorityEntity).isRequired,
  country: PropTypes.any,
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  operatorStatus: PropTypes.string,
  phoneNumber: PropTypes.string,
  registrationDate: PropTypes.string,
  statusChangeAuthor: PropTypes.any,
  statusChangeDate: PropTypes.any,
  uuid: PropTypes.string,
});
PropTypes.limitPeriodEntity = PropTypes.shape({
  [limitTypes.DEPOSIT]: PropTypes.arrayOf(PropTypes.string).isRequired,
  [limitTypes.SESSION_DURATION]: PropTypes.arrayOf(PropTypes.string).isRequired,
  [limitTypes.LOSS]: PropTypes.arrayOf(PropTypes.string).isRequired,
  [limitTypes.WAGER]: PropTypes.arrayOf(PropTypes.string).isRequired,
});
PropTypes.navSubItem = PropTypes.shape({
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
});
PropTypes.navItem = PropTypes.shape({
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  url: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.navSubItem),
});
PropTypes.userPanelItem = PropTypes.shape({
  fullName: PropTypes.string.isRequired,
  login: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
});
PropTypes.navbarNavItem = PropTypes.shape({
  label: PropTypes.any.isRequired,
  onClick: PropTypes.func,
});
PropTypes.auditEntity = PropTypes.shape({
  authorFullName: PropTypes.string.isRequired,
  authorUuid: PropTypes.string.isRequired,
  creationDate: PropTypes.string.isRequired,
  details: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  ip: PropTypes.string.isRequired,
  targetFullName: PropTypes.string.isRequired,
  targetUuid: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
});
PropTypes.paymentEntityStatus = PropTypes.shape({
  creationTime: PropTypes.string.isRequired,
  initiatorId: PropTypes.string.isRequired,
  initiatorType: PropTypes.string.isRequired,
  paymentStatus: PropTypes.string.isRequired,
  reason: PropTypes.any,
  reference: PropTypes.string.isRequired,
});
PropTypes.paymentEntity = PropTypes.shape({
  amount: PropTypes.price.isRequired,
  amountBarrierReached: PropTypes.bool.isRequired,
  baseCurrencyAmount: PropTypes.price,
  clientIp: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  creationTime: PropTypes.string.isRequired,
  creatorType: PropTypes.string.isRequired,
  creatorUUID: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  fraud: PropTypes.bool.isRequired,
  mobile: PropTypes.bool.isRequired,
  needApprove: PropTypes.bool.isRequired,
  paymentAccount: PropTypes.string,
  paymentFlowStatuses: PropTypes.arrayOf(PropTypes.paymentEntityStatus).isRequired,
  paymentId: PropTypes.string.isRequired,
  paymentMethod: PropTypes.string.isRequired,
  paymentSystemRefs: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  paymentType: PropTypes.string.isRequired,
  playerUUID: PropTypes.string.isRequired,
  reason: PropTypes.any,
  status: PropTypes.string.isRequired,
  success: PropTypes.bool,
  updateTime: PropTypes.string,
  userAgent: PropTypes.string.isRequired,
});
PropTypes.userPaymentAccountEntity = PropTypes.shape({
  creationDate: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  lastActivityDate: PropTypes.string.isRequired,
  lastPayment: PropTypes.paymentEntity.isRequired,
  paymentMethod: PropTypes.string.isRequired,
  playerUUID: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
});
PropTypes.paymentMethodLimit = PropTypes.shape({
  currencyCode: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  uuid: PropTypes.string.isRequired,
});
PropTypes.paymentMethod = PropTypes.shape({
  depositLimit: PropTypes.paymentMethodLimit.isRequired,
  methodName: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  withdrawLimit: PropTypes.paymentMethodLimit.isRequired,
});
PropTypes.paymentActionReasons = PropTypes.shape({
  reject: PropTypes.arrayOf(PropTypes.string),
  chargeback: PropTypes.arrayOf(PropTypes.string),
});
PropTypes.paymentReasonModalStaticParams = PropTypes.shape({
  title: PropTypes.string,
  actionButtonLabel: PropTypes.string,
  actionDescription: PropTypes.string,
});
PropTypes.walletLimitEntity = PropTypes.shape({
  author: PropTypes.string.isRequired,
  authorUUID: PropTypes.any,
  id: PropTypes.number.isRequired,
  playerUUID: PropTypes.string.isRequired,
  reason: PropTypes.string.isRequired,
  startLock: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
});
PropTypes.countryAccessEntity = PropTypes.shape({
  allowed: PropTypes.bool.isRequired,
  countryCode: PropTypes.string.isRequired,
  countryName: PropTypes.string.isRequired,
});
PropTypes.customValue = PropTypes.shape({
  type: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});
PropTypes.bonusCampaignEntity = PropTypes.shape({
  authorUUID: PropTypes.string.isRequired,
  bonusLifetime: PropTypes.number.isRequired,
  campaignName: PropTypes.string.isRequired,
  campaignPriority: PropTypes.number.isRequired,
  campaignRatio: PropTypes.customValue.isRequired,
  campaignUUID: PropTypes.string.isRequired,
  capping: PropTypes.customValue.isRequired,
  conversionPrize: PropTypes.customValue.isRequired,
  creationDate: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  grantedSum: PropTypes.number.isRequired,
  grantedTotal: PropTypes.number.isRequired,
  endDate: PropTypes.string.isRequired,
  campaignType: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  optIn: PropTypes.bool.isRequired,
  playerStates: PropTypes.arrayOf(PropTypes.any),
  startDate: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  statusChangedDate: PropTypes.string,
  targetType: PropTypes.string.isRequired,
  wagerWinMultiplier: PropTypes.number.isRequired,
});

export default PropTypes;
