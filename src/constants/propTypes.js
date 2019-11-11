import PropTypes from 'prop-types';

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
  login: PropTypes.string.isRequired,
  paymentId: PropTypes.string.isRequired,
  paymentType: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  creationTime: PropTypes.string.isRequired,
  paymentMethod: PropTypes.string,
  paymentAccount: PropTypes.string,
  accountType: PropTypes.string,
  amount: PropTypes.string,
  country: PropTypes.string,
  language: PropTypes.string,
  brandId: PropTypes.string,
  externalReference: PropTypes.string,
  playerProfile: PropTypes.paymentPlayer,
  paymentMetadata: PropTypes.paymentMetadata,
  originalAgent: PropTypes.paymentOriginalAgent,
});
PropTypes.paymentPlayer = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  fullName: PropTypes.string,
});
PropTypes.paymentMetadata = PropTypes.shape({
  clientIp: PropTypes.string,
  isMobile: PropTypes.bool,
  userAgent: PropTypes.string.isRequired,
  country: PropTypes.string,
});
PropTypes.paymentOriginalAgent = PropTypes.shape({
  uuid: PropTypes.string,
  fullName: PropTypes.string,
});
PropTypes.tradingActivityOriginalAgent = PropTypes.shape({
  uuid: PropTypes.string,
  fullName: PropTypes.string,
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
PropTypes.countryAccessEntity = PropTypes.shape({
  allowed: PropTypes.bool.isRequired,
  countryCode: PropTypes.string.isRequired,
  countryName: PropTypes.string.isRequired,
});
PropTypes.customValue = PropTypes.shape({
  type: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
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
PropTypes.mt4User = PropTypes.shape({
  login: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  balance: PropTypes.number,
  credit: PropTypes.number,
  equity: PropTypes.number,
  symbol: PropTypes.string,
  leverage: PropTypes.string,
  name: PropTypes.string,
  group: PropTypes.string,
  margin: PropTypes.number,
  createdBy: PropTypes.string,
  isReadOnly: PropTypes.bool,
  readOnlyUpdateTime: PropTypes.string,
  readOnlyUpdatedBy: PropTypes.shape({
    _id: PropTypes.string,
    fullName: PropTypes.string,
  }),
});
PropTypes.tradingProfile = PropTypes.shape({
  isTestUser: PropTypes.bool,
  aquisitionRep: PropTypes.tradingRepresentative,
  aquisitionStatus: PropTypes.string,
  kycStatus: PropTypes.string,
  salesRep: PropTypes.tradingRepresentative,
  salesStatus: PropTypes.string,
  retentionRep: PropTypes.tradingRepresentative,
  retentionStatus: PropTypes.string,
  kycRep: PropTypes.tradingRepresentative,
  balance: PropTypes.string,
  credit: PropTypes.string,
  equity: PropTypes.string,
  baseCurrencyBalance: PropTypes.string,
  baseCurrencyEquity: PropTypes.string,
  mt4Users: PropTypes.arrayOf(PropTypes.mt4User),
});
PropTypes.tradingRepresentative = PropTypes.shape({
  country: PropTypes.string,
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  operatorStatus: PropTypes.string,
  phoneNumber: PropTypes.string,
  registeredBy: PropTypes.string,
  registrationDate: PropTypes.string,
  statusChangeAuthor: PropTypes.string,
  statusChangeDate: PropTypes.string,
  statusReason: PropTypes.string,
  uuid: PropTypes.string,
});
PropTypes.chartEntity = PropTypes.shape({
  entries: PropTypes.number.isRequired,
  entryDate: PropTypes.string.isRequired,
});
PropTypes.chartTotal = PropTypes.shape({
  count: PropTypes.number,
  error: PropTypes.string,
});
PropTypes.paymentEntry = PropTypes.shape({
  amount: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  entryDate: PropTypes.string.isRequired,
});
PropTypes.lead = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  brandId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  surname: PropTypes.string.isRequired,
  phoneCode: PropTypes.string,
  phoneNumber: PropTypes.string,
  phone: PropTypes.string.isRequired,
  mobileCode: PropTypes.string,
  mobileNumber: PropTypes.string,
  status: PropTypes.string,
  email: PropTypes.string,
  country: PropTypes.string,
  source: PropTypes.string,
  salesAgent: PropTypes.shape({
    fullName: PropTypes.string,
    uuid: PropTypes.string,
  }),
  salesStatus: PropTypes.string,
  birthDate: PropTypes.string,
  affiliate: PropTypes.string,
  gender: PropTypes.string,
  city: PropTypes.string,
  language: PropTypes.string,
  registrationDate: PropTypes.string.isRequired,
  statusChangeDate: PropTypes.string,
});
PropTypes.branchHierarchyType = PropTypes.shape({
  name: PropTypes.string,
  brandId: PropTypes.string,
  branchType: PropTypes.string.isRequired,
  deskType: PropTypes.string,
  country: PropTypes.string,
  language: PropTypes.string,
  parentBranch: PropTypes.object,
  defaultBranch: PropTypes.string,
  defaultUser: PropTypes.string,
});
PropTypes.userHierarchyType = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  parentBranches: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
  })),
  parentUsers: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
  })),
  fullName: PropTypes.string,
});
PropTypes.hierarchyBranch = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  branchType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  country: PropTypes.string,
  defaultUser: PropTypes.string,
  parentBranches: PropTypes.arrayOf(PropTypes.string),
  deskType: PropTypes.string,
  language: PropTypes.string,
  defaultBranch: PropTypes.string,
});
PropTypes.ruleActionType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  parentBranch: PropTypes.string,
  parentUser: PropTypes.string,
  ruleType: PropTypes.string,
});
PropTypes.ruleType = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.ruleActionType),
  brandId: PropTypes.string,
  countries: PropTypes.arrayOf(PropTypes.string),
  createdAt: PropTypes.string,
  createdBy: PropTypes.string,
  deletedAt: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
  priority: PropTypes.number.isRequired,
  type: PropTypes.string,
  updatedBy: PropTypes.string,
});
PropTypes.tradingActivity = PropTypes.shape({
  id: PropTypes.number.isRequired,
  tradeId: PropTypes.number.isRequired,
  login: PropTypes.number.isRequired,
  symbol: PropTypes.string,
  digits: PropTypes.number,
  cmd: PropTypes.string,
  volume: PropTypes.number,
  openTime: PropTypes.number,
  closeTime: PropTypes.number,
  openPrice: PropTypes.number,
  closePrice: PropTypes.number,
  openRate: PropTypes.number,
  closeRate: PropTypes.number,
  stopLoss: PropTypes.number,
  takeProfit: PropTypes.number,
  expiration: PropTypes.number,
  reason: PropTypes.string,
  commission: PropTypes.number,
  commissionAgent: PropTypes.number,
  storage: PropTypes.number,
  profit: PropTypes.number,
  taxes: PropTypes.number,
  magic: PropTypes.number,
  comment: PropTypes.string,
  timestamp: PropTypes.number,
});
PropTypes.callback = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  status: PropTypes.string,
  callbackTime: PropTypes.string,
  creationTime: PropTypes.string,
  updateTime: PropTypes.string,
  userId: PropTypes.string,
  operatorId: PropTypes.string,
  client: PropTypes.shape({
    fullName: PropTypes.string,
  }),
  operator: PropTypes.shape({
    fullName: PropTypes.string,
  }),
});
PropTypes.operatorsList = PropTypes.arrayOf(PropTypes.shape({
  uuid: PropTypes.string,
  fullName: PropTypes.string,
}));

PropTypes.questionnaireLastData = PropTypes.shape({
  uuid: PropTypes.string,
  status: PropTypes.string,
  score: PropTypes.number,
  version: PropTypes.number,
  reviewedBy: PropTypes.string,
  updatedAt: PropTypes.string,
});

export default PropTypes;
