import PropTypes from 'prop-types';
import { types as limitTypes } from './limits';
import { countryStrategies } from './bonus-campaigns';

PropTypes.price = PropTypes.shape({
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  currency: PropTypes.string,
});
PropTypes.status = PropTypes.shape({
  author: PropTypes.string,
  comment: PropTypes.string,
  editDate: PropTypes.string,
  reason: PropTypes.string,
  value: PropTypes.string,
});
PropTypes.kycStatus = PropTypes.shape({
  authorUUID: PropTypes.string,
  statusDate: PropTypes.string,
  reason: PropTypes.string,
  status: PropTypes.string,
});
PropTypes.pageable = content => PropTypes.shape({
  first: PropTypes.bool,
  last: PropTypes.bool.isRequired,
  number: PropTypes.number,
  numberOfElements: PropTypes.number,
  size: PropTypes.number.isRequired,
  sort: PropTypes.arrayOf(PropTypes.shape({
    ascending: PropTypes.bool.isRequired,
    direction: PropTypes.string.isRequired,
    ignoreCase: PropTypes.bool.isRequired,
    nullHandling: PropTypes.string.isRequired,
    property: PropTypes.string.isRequired,
  })),
  totalElements: PropTypes.number.isRequired,
  totalPages: PropTypes.number,
  content: PropTypes.arrayOf(content).isRequired,
});
PropTypes.pageableState = content => PropTypes.shape({
  entities: PropTypes.pageable(content).isRequired,
  isLoading: PropTypes.bool.isRequired,
  receivedAt: PropTypes.number,
  error: PropTypes.object,
});
PropTypes.ipEntity = PropTypes.shape({
  browserAgent: PropTypes.string.isRequired,
  sessionId: PropTypes.string.isRequired,
  sessionStart: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  ip: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
});
PropTypes.operatorIpEntity = PropTypes.shape({
  agent: PropTypes.string.isRequired,
  signInDate: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  ipAddress: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
});
PropTypes.noteEntity = PropTypes.shape({
  tagId: PropTypes.string,
  content: PropTypes.string,
  creationDate: PropTypes.string,
  changedBy: PropTypes.string,
  pinned: PropTypes.bool,
  targetUUID: PropTypes.string,
});
PropTypes.gamingActivityEntity = PropTypes.shape({
  betDate: PropTypes.string,
  bonusBetAmount: PropTypes.price,
  bonusWinAmount: PropTypes.price,
  gameId: PropTypes.string.isRequired,
  gameProviderId: PropTypes.string.isRequired,
  gameRoundId: PropTypes.string.isRequired,
  gameSessionId: PropTypes.string.isRequired,
  playerUUID: PropTypes.string.isRequired,
  realBetAmount: PropTypes.price,
  realWinAmount: PropTypes.price,
  totalBetAmount: PropTypes.price,
  totalWinAmount: PropTypes.price,
  winDate: PropTypes.string,
  gameRoundType: PropTypes.string,
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
  bonusLifeTime: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  bonusType: PropTypes.string,
  bonusUUID: PropTypes.string,
  campaignUUID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  cancellerUUID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  cancellationReason: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
  convertedAmount: PropTypes.number,
  claimable: PropTypes.bool.isRequired,
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
  acceptedTermsUUID: PropTypes.string,
  address: PropTypes.string,
  addressKycMetaData: PropTypes.arrayOf(PropTypes.fileEntity),
  kycAddressStatus: PropTypes.kycStatus,
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
  languageCode: PropTypes.string,
  lastName: PropTypes.string,
  marketingMail: PropTypes.bool,
  marketingSMS: PropTypes.bool,
  personalKycMetaData: PropTypes.arrayOf(PropTypes.fileEntity),
  kycPersonalStatus: PropTypes.kycStatus,
  phoneNumber: PropTypes.string,
  phoneNumberVerified: PropTypes.bool,
  postCode: PropTypes.string,
  profileStatus: PropTypes.string,
  profileStatusComment: PropTypes.any,
  profileStatusReason: PropTypes.string,
  profileStatusDate: PropTypes.string,
  profileStatusAuthor: PropTypes.string,
  profileTags: PropTypes.arrayOf(PropTypes.any),
  registrationDate: PropTypes.string,
  registrationIP: PropTypes.string,
  suspendEndDate: PropTypes.any,
  title: PropTypes.string,
  token: PropTypes.string,
  tokenExpirationDate: PropTypes.string,
  login: PropTypes.string,
  username: PropTypes.string,
  playerUUID: PropTypes.string,
  signInIps: PropTypes.arrayOf(PropTypes.ipEntity),
  balances: PropTypes.shape({
    total: PropTypes.price.isRequired,
    bonus: PropTypes.price.isRequired,
    real: PropTypes.price.isRequired,
  }),
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
  fullName: PropTypes.string,
  username: PropTypes.string,
  uuid: PropTypes.string.isRequired,
});
PropTypes.auditEntity = PropTypes.shape({
  authorFullName: PropTypes.string.isRequired,
  authorUuid: PropTypes.string.isRequired,
  creationDate: PropTypes.string.isRequired,
  details: PropTypes.object,
  id: PropTypes.number.isRequired,
  ip: PropTypes.string,
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
  amountBarrierReached: PropTypes.bool,
  baseCurrencyAmount: PropTypes.price,
  clientIp: PropTypes.string,
  country: PropTypes.string,
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
  paymentMethod: PropTypes.string,
  paymentSystemRefs: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  paymentType: PropTypes.string.isRequired,
  playerUUID: PropTypes.string.isRequired,
  reason: PropTypes.any,
  status: PropTypes.string.isRequired,
  success: PropTypes.bool,
  transactionTag: PropTypes.string,
  updateTime: PropTypes.string,
  userAgent: PropTypes.string.isRequired,
  tradingAcc: PropTypes.string,
  symbol: PropTypes.string,
  accountType: PropTypes.string,
  externalReference: PropTypes.string,
});
PropTypes.userPaymentAccountEntity = PropTypes.shape({
  creationDate: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  lastActivityDate: PropTypes.string.isRequired,
  lastPayment: PropTypes.paymentEntity,
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
  reject: PropTypes.object,
  chargeback: PropTypes.object,
});
PropTypes.playerLimitEntity = PropTypes.shape({
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
  authorUUID: PropTypes.string,
  bonusLifeTime: PropTypes.number,
  campaignName: PropTypes.string,
  uuid: PropTypes.string,
  creationDate: PropTypes.string,
  optInPeriod: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  optInPeriodTimeUnit: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  linkedCampaignUUID: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  currency: PropTypes.string,
  grantedSum: PropTypes.number,
  grantedTotal: PropTypes.number,
  endDate: PropTypes.string,
  fulfillmentType: PropTypes.string,
  countryStrategy: PropTypes.oneOf([
    countryStrategies.INCLUDE,
    countryStrategies.EXCLUDE,
  ]),
  countries: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  optIn: PropTypes.bool,
  claimable: PropTypes.bool,
  startDate: PropTypes.string,
  state: PropTypes.string,
  stateReason: PropTypes.string,
  statusChangedDate: PropTypes.string,
  targetType: PropTypes.string,
  wagerWinMultiplier: PropTypes.number,
});
PropTypes.newBonusCampaignEntity = PropTypes.shape({
  uuid: PropTypes.string,
  state: PropTypes.string,
  name: PropTypes.string,
  authorUUID: PropTypes.string,
});
PropTypes.freeSpinEntity = PropTypes.shape({
  aggregatorId: PropTypes.string,
  authorUUID: PropTypes.string,
  betPerLine: PropTypes.price,
  capping: PropTypes.price,
  currencyCode: PropTypes.string,
  endDate: PropTypes.string,
  error: PropTypes.any,
  freeSpinStatus: PropTypes.string,
  freeSpinsAmount: PropTypes.number,
  gameId: PropTypes.string,
  gameName: PropTypes.string,
  linesPerSpin: PropTypes.number,
  name: PropTypes.string,
  playerUUID: PropTypes.string,
  prize: PropTypes.price,
  providerId: PropTypes.string,
  reason: PropTypes.any,
  startDate: PropTypes.string,
  spinValue: PropTypes.price,
  status: PropTypes.string,
  statusChangedAuthorUUID: PropTypes.string,
  statusChangedDate: PropTypes.any,
  totalValue: PropTypes.price,
  uuid: PropTypes.string,
  playedCount: PropTypes.number,
  winning: PropTypes.price,
  claimable: PropTypes.bool,
});
PropTypes.freeSpinListEntity = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});
PropTypes.bonusTemplateListEntity = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});
PropTypes.gameEntity = PropTypes.shape({
  aggregatorId: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  fullGameName: PropTypes.string.isRequired,
  gameId: PropTypes.string.isRequired,
  gameInfoType: PropTypes.string.isRequired,
  gameProviderId: PropTypes.string.isRequired,
  gameType: PropTypes.string.isRequired,
  lines: PropTypes.any,
  startGameUrl: PropTypes.string.isRequired,
  stopGameUrl: PropTypes.string.isRequired,
});
PropTypes.userDeviceEntity = PropTypes.shape({
  deviceType: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  lastSignInCountryCode: PropTypes.string.isRequired,
  lastSignInDate: PropTypes.string.isRequired,
  lastSignInIP: PropTypes.string.isRequired,
  operatingSystem: PropTypes.string.isRequired,
  totalSignIn: PropTypes.number.isRequired,
});
PropTypes.kycRequestStatusEntity = PropTypes.shape({
  authorUUID: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  reason: PropTypes.string.isRequired,
  statusDate: PropTypes.string.isRequired,
});
PropTypes.kycRequestEntity = PropTypes.shape({
  birthDate: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  languageCode: PropTypes.string.isRequired,
  kycAddressStatus: PropTypes.kycRequestStatusEntity.isRequired,
  kycPersonalStatus: PropTypes.kycRequestStatusEntity.isRequired,
  kycRequest: {
    requestDate: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    authorUUID: PropTypes.string.isRequired,
  },
  playerUUID: PropTypes.string.isRequired,
});
PropTypes.meta = PropTypes.shape({
  data: PropTypes.shape({
    countryCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    phoneCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    currencyCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    countries: PropTypes.arrayOf(PropTypes.object).isRequired,
    passwordPattern: PropTypes.string.isRequired,
  }).isRequired,
  source: PropTypes.shape({
    post: PropTypes.shape({
      country: PropTypes.shape({
        list: PropTypes.arrayOf(PropTypes.shape({
          countryCode: PropTypes.string,
          phoneCode: PropTypes.string,
        })),
      }),
      currency: PropTypes.shape({
        base: PropTypes.string,
        list: PropTypes.arrayOf(PropTypes.string),
      }),
      password: PropTypes.shape({
        pattern: PropTypes.string,
      }),
      phoneCode: PropTypes.shape({
        list: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
    geolocation: PropTypes.shape({
      country: PropTypes.string.isRequired,
      currencyCode: PropTypes.string.isRequired,
      ip: PropTypes.string.isRequired,
      phoneCode: PropTypes.string.isRequired,
    }),
  }).isRequired,
  playerMeta: PropTypes.shape({
    countryCode: PropTypes.string,
    phoneCode: PropTypes.string,
    currencyCode: PropTypes.string,
  }).isRequired,
});
PropTypes.brand = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    style: PropTypes.shape({
      width: PropTypes.string,
      height: PropTypes.string,
    }),
  }).isRequired,
});
PropTypes.department = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  image: PropTypes.string.isRequired,
});
PropTypes.wageringFulfillmentEntity = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  amounts: PropTypes.arrayOf(PropTypes.price),
});
PropTypes.subTabRouteEntity = PropTypes.shape({
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  permissions: PropTypes.object.isRequired,
});
PropTypes.modalType = PropTypes.shape({
  show: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
});
PropTypes.rewardPlanAmount = PropTypes.shape({
  amount: PropTypes.number,
  isActive: PropTypes.bool,
});
PropTypes.mt4User = PropTypes.shape({
  login: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  balance: PropTypes.string,
  equity: PropTypes.string,
  symbol: PropTypes.string,
});
PropTypes.tradingProfile = PropTypes.shape({
  isTestUser: PropTypes.bool,
  aquisitionRep: PropTypes.string,
  aquisitionStatus: PropTypes.string,
  kycStatus: PropTypes.string,
  salesRep: PropTypes.string,
  salesStatus: PropTypes.string,
  retentionRep: PropTypes.string,
  retentionStatus: PropTypes.string,
  kycRep: PropTypes.string,
  balance: PropTypes.string,
  equity: PropTypes.string,
  baseCurrencyBalance: PropTypes.string,
  baseCurrencyEquity: PropTypes.string,
  mt4Users: PropTypes.arrayOf(PropTypes.mt4User),
});

export default PropTypes;
