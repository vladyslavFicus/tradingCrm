import PropTypes from 'prop-types';

PropTypes.router = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object,
    state: PropTypes.object,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    state: PropTypes.object,
  }).isRequired,
};

PropTypes.pageable = content => PropTypes.shape({
  first: PropTypes.bool,
  last: PropTypes.bool,
  number: PropTypes.number,
  numberOfElements: PropTypes.number,
  size: PropTypes.number,
  sort: PropTypes.arrayOf(PropTypes.shape({
    ascending: PropTypes.bool.isRequired,
    direction: PropTypes.string.isRequired,
    ignoreCase: PropTypes.bool.isRequired,
    nullHandling: PropTypes.string.isRequired,
    property: PropTypes.string.isRequired,
  })),
  totalElements: PropTypes.number,
  totalPages: PropTypes.number,
  content: PropTypes.arrayOf(content).isRequired,
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
  author: PropTypes.string,
  category: PropTypes.string,
  name: PropTypes.string,
  playerUuid: PropTypes.string,
  realName: PropTypes.string,
  status: PropTypes.string,
  type: PropTypes.string,
  uploadDate: PropTypes.string,
  uuid: PropTypes.string,
});

PropTypes.uploadingFile = PropTypes.shape({
  fileUuid: PropTypes.string.isRequired,
  error: PropTypes.string,
});

PropTypes.authorityEntity = PropTypes.shape({
  id: PropTypes.number,
  department: PropTypes.string,
  role: PropTypes.string,
});

PropTypes.operator = PropTypes.shape({
  country: PropTypes.any,
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  fullName: PropTypes.string,
  operatorStatus: PropTypes.string,
  phoneNumber: PropTypes.string,
  sip: PropTypes.string,
  registrationDate: PropTypes.string,
  statusChangeAuthor: PropTypes.any,
  statusChangeDate: PropTypes.any,
  uuid: PropTypes.string,
  parentBranches: PropTypes.shape({
    branchType: PropTypes.string,
    uuid: PropTypes.string,
  }),
});

PropTypes.partner = PropTypes.shape({
  affiliateType: PropTypes.string,
  authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
  country: PropTypes.string,
  createdAt: PropTypes.string,
  createdBy: PropTypes.string,
  email: PropTypes.string,
  externalAffiliateId: PropTypes.string,
  firstName: PropTypes.string,
  fullName: PropTypes.string,
  lastName: PropTypes.string,
  permission: PropTypes.shape({
    allowedIpAddresses: PropTypes.arrayOf(PropTypes.string),
    forbiddenCountries: PropTypes.arrayOf(PropTypes.string),
    showFTDAmount: PropTypes.bool,
    showKycStatus: PropTypes.bool,
    showNotes: PropTypes.bool,
    showSalesStatus: PropTypes.bool,
  }),
  phone: PropTypes.string,
  public: PropTypes.bool,
  status: PropTypes.string,
  statusChangeAuthor: PropTypes.string,
  statusChangeDate: PropTypes.string,
  statusReason: PropTypes.string,
  uuid: PropTypes.uuid,
  schedule: PropTypes.arrayOf(PropTypes.shape({
    activated: PropTypes.bool,
    day: PropTypes.string,
    totalLimit: PropTypes.number,
    countrySpreads: PropTypes.arrayOf(PropTypes.shape({
      country: PropTypes.string,
      limit: PropTypes.number,
    })),
    workingHoursFrom: PropTypes.string,
    workingHoursTo: PropTypes.string,
  })),
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

PropTypes.auditEntity = PropTypes.shape({
  authorFullName: PropTypes.string.isRequired,
  authorUuid: PropTypes.string.isRequired,
  creationDate: PropTypes.string.isRequired,
  details: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  ip: PropTypes.string,
  targetFullName: PropTypes.string.isRequired,
  targetUuid: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
});

PropTypes.paymentEntity = PropTypes.shape({
  login: PropTypes.string.isRequired,
  paymentId: PropTypes.string.isRequired,
  paymentType: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  withdrawalStatus: PropTypes.string,
  currency: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  creationTime: PropTypes.string.isRequired,
  paymentMethod: PropTypes.string,
  paymentAccount: PropTypes.string,
  platformType: PropTypes.string,
  accountType: PropTypes.string,
  amount: PropTypes.string,
  country: PropTypes.string,
  language: PropTypes.string,
  brandId: PropTypes.string,
  externalReference: PropTypes.string,
  playerProfile: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    fullName: PropTypes.string,
  }),
  paymentMetadata: PropTypes.shape({
    clientIp: PropTypes.string,
    mobile: PropTypes.bool,
    userAgent: PropTypes.string.isRequired,
    country: PropTypes.string,
  }),
  originalAgent: PropTypes.shape({
    uuid: PropTypes.string,
    fullName: PropTypes.string,
  }),
  warnings: PropTypes.arrayOf(PropTypes.string),
});

PropTypes.tradingActivityOriginalAgent = PropTypes.shape({
  uuid: PropTypes.string,
  fullName: PropTypes.string,
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

PropTypes.department = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  role: PropTypes.string,
  image: PropTypes.string,
});

PropTypes.brand = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.string,
  departments: PropTypes.arrayOf(PropTypes.department),
});

PropTypes.modalType = PropTypes.shape({
  show: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
});

PropTypes.tradingAccount = PropTypes.shape({
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
  readOnlyUpdatedBy: PropTypes.string,
});

PropTypes.tradingAccountsItem = PropTypes.shape({
  uuid: PropTypes.string,
  platformType: PropTypes.string,
  profile: PropTypes.shape({
    uuid: PropTypes.string,
    fullName: PropTypes.string,
  }),
  affiliate: PropTypes.shape({
    source: PropTypes.string,
  }),
  createdAt: PropTypes.string,
  leverage: PropTypes.number,
  balance: PropTypes.number,
  archived: PropTypes.bool,
  accountType: PropTypes.string,
});

PropTypes.chartEntity = PropTypes.shape({
  entries: PropTypes.number.isRequired,
  entryDate: PropTypes.string.isRequired,
});

PropTypes.chartTotal = PropTypes.shape({
  count: PropTypes.number,
  error: PropTypes.string,
});

PropTypes.RegisteredUsersAdditionalStatField = PropTypes.shape({
  value: PropTypes.number.isRequired,
});

PropTypes.lead = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  brandId: PropTypes.string,
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
  birthDate: PropTypes.string,
  affiliate: PropTypes.string,
  gender: PropTypes.string,
  city: PropTypes.string,
  language: PropTypes.string,
  registrationDate: PropTypes.string,
  statusChangeDate: PropTypes.string,
  acquisition: PropTypes.acquisition,
});

PropTypes.leadResult = PropTypes.shape({
  name: PropTypes.string,
  surname: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  country: PropTypes.string,
  source: PropTypes.string,
  birthDate: PropTypes.string,
  affiliate: PropTypes.string,
  gender: PropTypes.string,
  city: PropTypes.string,
  language: PropTypes.string,
  failureReason: PropTypes.string,
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
  operator: PropTypes.operator,
});

PropTypes.hierarchyBranch = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  branchType: PropTypes.string,
  name: PropTypes.string.isRequired,
  country: PropTypes.string,
  defaultUser: PropTypes.string,
  parentBranches: PropTypes.arrayOf(PropTypes.string),
  deskType: PropTypes.string,
  language: PropTypes.string,
  defaultBranch: PropTypes.string,
});

PropTypes.ruleType = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  operatorSpreads: PropTypes.arrayOf(
    PropTypes.shape({
      operator: PropTypes.operator,
      parentUser: PropTypes.string,
      percentage: PropTypes.number,
    }),
  ),
  parentBranch: PropTypes.string,
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

PropTypes.ruleSourceBrandConfigsType = PropTypes.shape({
  brand: PropTypes.string,
  sortType: PropTypes.string,
  migrationSource: PropTypes.string,
  operator: PropTypes.string,
  operatorEntity: PropTypes.operatorsListEntity,
  country: PropTypes.string,
  distributionUnit: PropTypes.shape({
    quantity: PropTypes.number,
    baseUnit: PropTypes.string,
  }),
  desks: PropTypes.arrayOf(PropTypes.string),
  teams: PropTypes.arrayOf(PropTypes.string),
});

PropTypes.ruleClientsDistributionType = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  name: PropTypes.string,
  order: PropTypes.number,
  status: PropTypes.string,
  createdBy: PropTypes.string,
  createdAt: PropTypes.string,
  countries: PropTypes.arrayOf(PropTypes.string),
  languages: PropTypes.arrayOf(PropTypes.string),
  salesStatuses: PropTypes.arrayOf(PropTypes.string),
  targetSalesStatus: PropTypes.string,
  executionType: PropTypes.string,
  registrationDateRange: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  registrationPeriodInHours: PropTypes.number,
  lastNoteDateRange: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  lastNotePeriodInHours: PropTypes.number,
  executionPeriodInHours: PropTypes.number,
  latestMigration: PropTypes.shape({
    uuid: PropTypes.string,
    startDate: PropTypes.string,
    status: PropTypes.string,
    ruleUuid: PropTypes.string,
    clientsAmount: PropTypes.number,
  }),
  sourceBrandConfigs: PropTypes.arrayOf(PropTypes.ruleSourceBrandConfigsType),
  targetBrandConfigs: PropTypes.arrayOf(PropTypes.ruleSourceBrandConfigsType),
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
  callbackId: PropTypes.string,
  status: PropTypes.string,
  callbackTime: PropTypes.string,
  creationTime: PropTypes.string,
  updateTime: PropTypes.string,
  note: PropTypes.object,
  userId: PropTypes.string,
  operatorId: PropTypes.string,
  client: PropTypes.shape({
    fullName: PropTypes.string,
  }),
  operator: PropTypes.shape({
    fullName: PropTypes.string,
  }),
});

PropTypes.operatorsListEntity = PropTypes.shape({
  uuid: PropTypes.string,
  fullName: PropTypes.string,
  operatorStatus: PropTypes.string,
  hierarchy: PropTypes.shape({
    uuid: PropTypes.string,
    userType: PropTypes.string,
  }),
});

PropTypes.operatorsList = PropTypes.arrayOf(PropTypes.operatorsListEntity);
PropTypes.partnersListEntity = PropTypes.shape({
  uuid: PropTypes.string,
  fullName: PropTypes.string,
  createdAt: PropTypes.string,
  externalAffiliateId: PropTypes.string,
  status: PropTypes.string,
  statusChangeDate: PropTypes.string,
  country: PropTypes.string,
});

PropTypes.partnersList = PropTypes.arrayOf(PropTypes.partnersListEntity);
PropTypes.feed = PropTypes.shape({
  authorFullName: PropTypes.string,
  authorUuid: PropTypes.string,
  brandId: PropTypes.string,
  creationDate: PropTypes.string,
  details: PropTypes.string,
  id: PropTypes.number,
  ip: PropTypes.string,
  targetFullName: PropTypes.string,
  tragetUuid: PropTypes.string,
  uuid: PropTypes.string,
});

PropTypes.auth = PropTypes.shape({
  department: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
});

PropTypes.permission = PropTypes.shape({
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  allows: PropTypes.func.isRequired,
  denies: PropTypes.func.isRequired,
});

PropTypes.storage = PropTypes.shape({
  get: PropTypes.func.isRequired,
  set: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
});

PropTypes.paymentsStatistic = PropTypes.shape({
  data: PropTypes.shape({
    paymentsStatistic: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number,
          count: PropTypes.number,
          entryDate: PropTypes.string,
        }).isRequired,
      ).isRequired,
      itemsTotal: PropTypes.shape({
        totalAmount: PropTypes.number,
        totalCount: PropTypes.number,
      }),
      additionalTotal: PropTypes.shape({
        totalCount: PropTypes.number,
        totalAmount: PropTypes.number,
        monthCount: PropTypes.number,
        monthAmount: PropTypes.number,
        todayCount: PropTypes.number,
        todayAmount: PropTypes.number,
      }),
    }),
  }),
  refetch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
});

PropTypes.profileView = PropTypes.shape({
  balance: PropTypes.shape({
    amount: PropTypes.string,
    credit: PropTypes.string,
  }),
  lastSignInSessions: PropTypes.arrayOf(PropTypes.shape({
    countryCode: PropTypes.string,
    ip: PropTypes.string,
    startedAt: PropTypes.string,
  })),
  registrationDetails: PropTypes.shape({
    deviceDetails: PropTypes.shape({
      deviceType: PropTypes.string,
      operatingSystem: PropTypes.string,
    }),
    inetDetails: PropTypes.shape({
      host: PropTypes.string,
      ipAddress: PropTypes.string,
      referer: PropTypes.string,
    }),
    locationDetails: PropTypes.shape({
      city: PropTypes.string,
      countryCode: PropTypes.string,
      region: PropTypes.string,
    }),
    registeredBy: PropTypes.string,
    registrationDate: PropTypes.string,
    userAgent: PropTypes.string,
  }),
  status: PropTypes.shape({
    changedAt: PropTypes.string,
    changedBy: PropTypes.string,
    comment: PropTypes.string,
    reason: PropTypes.string,
    type: PropTypes.string,
  }),
  tradingAccounts: PropTypes.arrayOf(PropTypes.object),
  uuid: PropTypes.string,
  lastActivity: PropTypes.shape({
    date: PropTypes.string,
  }),
  warnings: PropTypes.arrayOf(PropTypes.string),
});

PropTypes.profile = PropTypes.shape({
  acquisition: PropTypes.acquisition,
  address: PropTypes.shape({
    address: PropTypes.string,
    city: PropTypes.string,
    countryCode: PropTypes.string,
    postCode: PropTypes.string,
    state: PropTypes.string,
  }),
  affiliate: PropTypes.shape({
    externalId: PropTypes.string,
    firstName: PropTypes.string,
    referral: PropTypes.string,
    sms: PropTypes.string,
    source: PropTypes.string,
    campaignId: PropTypes.string,
    uuid: PropTypes.string,
  }),
  age: PropTypes.string,
  birthDate: PropTypes.string,
  brandId: PropTypes.string,
  clientType: PropTypes.string,
  configuration: PropTypes.shape({
    crs: PropTypes.bool,
    fatca: PropTypes.bool,
    gdpr: PropTypes.shape({
      email: PropTypes.bool,
      phone: PropTypes.bool,
      sms: PropTypes.bool,
      socialMedia: PropTypes.bool,
    }),
    internalTransfer: PropTypes.bool,
    subscription: PropTypes.shape({
      educational: PropTypes.bool,
      information: PropTypes.bool,
      marketNews: PropTypes.bool,
      promosAndOffers: PropTypes.bool,
      statisticsAndSummary: PropTypes.bool,
    }),
    webCookies: PropTypes.shape({
      enabled: PropTypes.bool,
    }),
  }),
  contacts: PropTypes.shape({
    additionalEmail: PropTypes.string,
    additionalPhone: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }),
  convertedFromLeadUuid: PropTypes.string,
  emailVerified: PropTypes.bool,
  firstName: PropTypes.string,
  gender: PropTypes.string,
  identificationNumber: PropTypes.string,
  kyc: PropTypes.shape({
    changedAt: PropTypes.string,
    status: PropTypes.string,
  }),
  languageCode: PropTypes.string,
  lastName: PropTypes.string,
  lastUpdatedBy: PropTypes.string,
  lastUpdatedDate: PropTypes.string,
  migrationId: PropTypes.string,
  passport: PropTypes.shape({
    countryOfIssue: PropTypes.string,
    countrySpecificIdentifier: PropTypes.string,
    countrySpecificIdentifierType: PropTypes.string,
    expirationDate: PropTypes.string,
    issueDate: PropTypes.string,
    number: PropTypes.string,
  }),
  phoneVerified: PropTypes.bool,
  profileVerified: PropTypes.bool,
  profileView: PropTypes.profileView,
  registrationDetails: PropTypes.shape({
    deviceDetails: PropTypes.shape({
      deviceType: PropTypes.string,
      operatingSystem: PropTypes.string,
    }),
    inetDetails: PropTypes.shape({
      host: PropTypes.string,
      ipAddress: PropTypes.string,
      referer: PropTypes.string,
    }),
    locationDetails: PropTypes.shape({
      city: PropTypes.string,
      countryCode: PropTypes.string,
      region: PropTypes.string,
    }),
    registeredBy: PropTypes.string,
    registrationDate: PropTypes.string,
    userAgent: PropTypes.string,
  }),
  status: PropTypes.shape({
    changedAt: PropTypes.string,
    changedBy: PropTypes.string,
    comment: PropTypes.string,
    reason: PropTypes.string,
    type: PropTypes.string,
  }),
  uuid: PropTypes.string,
});

PropTypes.paymentMethods = PropTypes.arrayOf(PropTypes.string);
PropTypes.email = PropTypes.shape({
  id: PropTypes.string,
  text: PropTypes.string,
  subject: PropTypes.string,
  name: PropTypes.string,
});

PropTypes.manualPaymentMethods = PropTypes.shape({
  data: PropTypes.shape({
    manualPaymentMethods: PropTypes.arrayOf(PropTypes.string),
  }),
  loading: PropTypes.bool.isRequired,
});

PropTypes.response = content => PropTypes.shape({
  data: PropTypes.shape(content),
  error: PropTypes.object,
});

PropTypes.query = content => PropTypes.shape({
  data: PropTypes.oneOfType([PropTypes.shape(content), PropTypes.object]),
  loading: PropTypes.bool,
  loadMore: PropTypes.func,
  refetch: PropTypes.func,
  error: PropTypes.object,
});

PropTypes.subscription = content => PropTypes.shape({
  data: PropTypes.oneOfType([PropTypes.shape(content), PropTypes.object]),
  loading: PropTypes.bool,
  error: PropTypes.any,
});

PropTypes.branchHierarchyResponse = PropTypes.query({
  branch: PropTypes.shape({
    ...PropTypes.hierarchyBranch,
    parentBranch: {
      ...PropTypes.hierarchyBranch,
      parentBranch: {
        ...PropTypes.hierarchyBranch,
      },
    },
  }),
});

PropTypes.userBranchHierarchyResponse = PropTypes.query({
  userBranches: PropTypes.shape({
    OFFICE: PropTypes.arrayOf(PropTypes.hierarchyBranch),
    DESK: PropTypes.arrayOf(PropTypes.hierarchyBranch),
    TEAM: PropTypes.arrayOf(PropTypes.hierarchyBranch),
    BRAND: PropTypes.arrayOf(PropTypes.hierarchyBranch),
  }),
});

PropTypes.notificationCenter = PropTypes.shape({
  read: PropTypes.bool,
  uuid: PropTypes.string,
  priority: PropTypes.string,
  client: PropTypes.shape({
    uuid: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    languageCode: PropTypes.string,
  }),
  createdAt: PropTypes.string,
  type: PropTypes.string,
  subtype: PropTypes.string,
  details: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currency: PropTypes.string,
  }),
});

PropTypes.treeBranch = PropTypes.shape({
  uuid: PropTypes.string,
  name: PropTypes.string,
  branchType: PropTypes.string,
  managerUuid: PropTypes.string,
  manager: PropTypes.operator,
  usersCount: PropTypes.number,
  childrenCount: PropTypes.number,
});

PropTypes.referral = PropTypes.shape({
  referralInfo: PropTypes.shape({
    name: PropTypes.string,
    profileUuid: PropTypes.string,
    languageCode: PropTypes.string,
    countryCode: PropTypes.string,
    registrationDate: PropTypes.string,
  }),
  bonusType: PropTypes.string,
  ftdInfo: PropTypes.shape({
    date: PropTypes.string,
    amount: PropTypes.number,
    currency: PropTypes.string,
    normalizedAmount: PropTypes.string,
  }),
  remuneration: PropTypes.shape({
    date: PropTypes.string,
    amount: PropTypes.number,
    currency: PropTypes.string,
    normalizedAmount: PropTypes.string,
  }),
  acquisition: PropTypes.shape({
    acquisitionStatus: PropTypes.string,
    retentionStatus: PropTypes.string,
    retentionOperator: PropTypes.shape({
      fullName: PropTypes.string,
      hierarchy: PropTypes.shape({
        parentBranches: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            branchType: PropTypes.string,
            parentBranch: PropTypes.shape({
              name: PropTypes.string,
              branchType: PropTypes.string,
            }),
          }),
        ),
      }),
    }),
    salesStatus: PropTypes.string,
    salesOperator: PropTypes.shape({
      fullName: PropTypes.string,
      hierarchy: PropTypes.shape({
        parentBranches: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            branchType: PropTypes.string,
            parentBranch: PropTypes.shape({
              name: PropTypes.string,
              branchType: PropTypes.string,
            }),
          }),
        ),
      }),
    }),
  }),
});

PropTypes.acquisition = PropTypes.shape({
  acquisitionStatus: PropTypes.string,
  retentionRepresentative: PropTypes.string,
  retentionStatus: PropTypes.string,
  retentionOperator: PropTypes.shape({
    firstName: PropTypes.string,
    hierarchy: PropTypes.shape({
      parentBranches: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          branchType: PropTypes.string,
          parentBranch: PropTypes.shape({
            name: PropTypes.string,
            branchType: PropTypes.string,
          }),
        }),
      ),
    }),
  }),
  salesRepresentative: PropTypes.string,
  salesStatus: PropTypes.string,
  salesOperator: PropTypes.shape({
    firstName: PropTypes.string,
    hierarchy: PropTypes.shape({
      parentBranches: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          branchType: PropTypes.string,
          parentBranch: PropTypes.shape({
            name: PropTypes.string,
            branchType: PropTypes.string,
          }),
        }),
      ),
    }),
  }),
});

PropTypes.brandConfig = PropTypes.shape({
  brandId: PropTypes.string,
  brandName: PropTypes.string,
  config: PropTypes.object,
});

PropTypes.TableSelection = PropTypes.shape({
  all: PropTypes.bool.isRequired,
  touched: PropTypes.array.isRequired,
  max: PropTypes.number.isRequired,
  selected: PropTypes.number.isRequired,
  reset: PropTypes.func.isRequired,
});

export default PropTypes;
