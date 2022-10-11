import keyMirror from 'keymirror';
import permissions from '../config/permissions';

const attributeLabels = {
  acceptedTermsUUID: 'CONSTANTS.AUDIT.TYPES.ACCEPTED_TERMS_UUID',
  additionalPhone: 'CONSTANTS.AUDIT.TYPES.ADDITIONAL_PHONE',
  additionalEmail: 'CONSTANTS.AUDIT.TYPES.ADDITIONAL_EMAIL',
  address: 'CONSTANTS.AUDIT.TYPES.ADDRESS',
  addressKycMetaData: 'CONSTANTS.AUDIT.TYPES.ADDRESS_KYC_METADATA',
  affiliateUuid: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_UUID',
  affiliateFirstName: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_FIRST_NAME',
  affiliateReferral: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_REFERRAL',
  affiliateSource: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_SOURCE',
  kycAddressStatus: 'CONSTANTS.AUDIT.TYPES.KYC_ADDRESS_STATUS',
  affiliateId: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_ID',
  birthDate: 'CONSTANTS.AUDIT.TYPES.BIRTH_DATE',
  btag: 'CONSTANTS.AUDIT.TYPES.BTAG',
  bankDetails: 'CONSTANTS.AUDIT.TYPES.BANK_DETAILS',
  changedAt: 'CONSTANTS.AUDIT.TYPES.CHANGED_AT',
  changeLeverageFrom: 'CONSTANTS.AUDIT.TYPES.CHANGE_LEVERAGE_FROM',
  changeLeverageTo: 'CONSTANTS.AUDIT.TYPES.CHANGE_LEVERAGE_TO',
  city: 'CONSTANTS.AUDIT.TYPES.CITY',
  clientType: 'CONSTANTS.AUDIT.TYPES.CLIENT_TYPE',
  completed: 'CONSTANTS.AUDIT.TYPES.COMPLETED',
  confirmedEmail: 'CONSTANTS.AUDIT.TYPES.CONFIRMED_EMAIL',
  convertedToClient: 'CONSTANTS.AUDIT.TYPES.CONVERTED_TO_CLIENT',
  convertedToClientUuid: 'CONSTANTS.AUDIT.TYPES.CONVERTED_TO_CLIENT_UUID',
  convertedByOperatorUuid: 'CONSTANTS.AUDIT.TYPES.CONVERTED_BY_OPERATOR_UUID',
  country: 'CONSTANTS.AUDIT.TYPES.COUNTRY',
  countryCode: 'CONSTANTS.AUDIT.TYPES.COUNTRY_CODE',
  countrySpecificIdentifier: 'CONSTANTS.AUDIT.TYPES.COUNTRY_SPECIFIC_IDENTIFIER',
  countrySpecificIdentifierType: 'CONSTANTS.AUDIT.TYPES.COUNTRY_SPECIFIC_IDENTIFIER_TYPE',
  contacts: 'CONSTANTS.AUDIT.TYPES.CONTACTS',
  countryOfIssue: 'CONSTANTS.AUDIT.TYPES.COUNTRY_OF_ISSUE',
  currency: 'CONSTANTS.AUDIT.TYPES.CURRENCY',
  phone: 'CONSTANTS.AUDIT.TYPES.PHONE',
  email: 'CONSTANTS.AUDIT.TYPES.EMAIL',
  expirationDate: 'CONSTANTS.AUDIT.TYPES.EXPIRATION_DATE',
  firstName: 'CONSTANTS.AUDIT.TYPES.FIRST_NAME',
  name: 'CONSTANTS.AUDIT.TYPES.FIRST_NAME',
  gender: 'CONSTANTS.AUDIT.TYPES.GENDER',
  id: 'CONSTANTS.AUDIT.TYPES.ID',
  identifier: 'CONSTANTS.AUDIT.TYPES.IDENTIFIER',
  identificationNumber: 'CONSTANTS.AUDIT.TYPES.IDENTIFICATION_NUMBER',
  issueDate: 'CONSTANTS.AUDIT.TYPES.ISSUE_DATE',
  kycCompleted: 'CONSTANTS.AUDIT.TYPES.KYC_COMPLETED',
  languageCode: 'CONSTANTS.AUDIT.TYPES.LANGUAGE_CODE',
  lastName: 'CONSTANTS.AUDIT.TYPES.LAST_NAME',
  surname: 'CONSTANTS.AUDIT.TYPES.LAST_NAME',
  marketingMail: 'CONSTANTS.AUDIT.TYPES.MARKETING_MAIL',
  marketingSMS: 'CONSTANTS.AUDIT.TYPES.MARKETING_SMS',
  mt4Login: 'CONSTANTS.AUDIT.TYPES.MT4LOGIN',
  personalKycMetaData: 'CONSTANTS.AUDIT.TYPES.PERSONAL_KYC_METADATA',
  kycPersonalStatus: 'CONSTANTS.AUDIT.TYPES.KYC_PERSONAL_STATUS',
  mobile: 'CONSTANTS.AUDIT.TYPES.PHONE_NUMBER',
  phoneNumber: 'CONSTANTS.AUDIT.TYPES.PHONE_NUMBER',
  phoneNumberVerified: 'CONSTANTS.AUDIT.TYPES.PHONE_NUMBER_VERIFIED',
  postCode: 'CONSTANTS.AUDIT.TYPES.POST_CODE',
  profileStatus: 'CONSTANTS.AUDIT.TYPES.PROFILE_STATUS',
  profileStatusComment: 'CONSTANTS.AUDIT.TYPES.PROFILE_STATUS_COMMENT',
  profileStatusReason: 'CONSTANTS.AUDIT.TYPES.PROFILE_STATUS_REASON',
  registrationDate: 'CONSTANTS.AUDIT.TYPES.REGISTRATION_DATE',
  registrationIp: 'CONSTANTS.AUDIT.TYPES.REGISTRATION_IP',
  registrationIP: 'CONSTANTS.AUDIT.TYPES.REGISTRATION_IP',
  reason: 'CONSTANTS.AUDIT.TYPES.REASON',
  registeredBy: 'CONSTANTS.AUDIT.TYPES.REGISTERED_BY',
  state: 'CONSTANTS.AUDIT.TYPES.STATE',
  status: 'CONSTANTS.AUDIT.TYPES.STATUS',
  statusChangedDate: 'CONSTANTS.AUDIT.TYPES.STATUS_CHANGED_DATE',
  suspendEndDate: 'CONSTANTS.AUDIT.TYPES.SUSPEND_END_DATE',
  title: 'CONSTANTS.AUDIT.TYPES.TITLE',
  type: 'CONSTANTS.AUDIT.TYPES.TYPE',
  token: 'CONSTANTS.AUDIT.TYPES.TOKEN',
  tokenExpirationDate: 'CONSTANTS.AUDIT.TYPES.TOKEN_EXPIRATION_DATE',
  username: 'CONSTANTS.AUDIT.TYPES.USERNAME',
  updatedDate: 'CONSTANTS.AUDIT.TYPES.UPDATED_DATE',
  playerUUID: 'CONSTANTS.AUDIT.TYPES.PLAYER_UUID',
  passportNumber: 'CONSTANTS.AUDIT.TYPES.PASSPORT_NUMBER',
  number: 'CONSTANTS.AUDIT.TYPES.PASSPORT_NUMBER',
  passPortExpirationDate: 'CONSTANTS.AUDIT.TYPES.PASSPORT_EXPIRATION_DATE',
  totalScore: 'CONSTANTS.AUDIT.TYPES.TOTAL_SCORE',
  riskCategory: 'CONSTANTS.AUDIT.TYPES.RISK_CATEGORY',
  // for NEW_OPERATOR_ACCOUNT_CREATED & OPERATOR_ACCOUNT_CREATED
  operatorsName: 'FEED_ITEM.OPERATOR_CREATION.OPERATOR_NAME',
  department: 'COMMON.DEPARTMENT',
  role: 'COMMON.ROLE',
  invitationSent: 'FEED_ITEM.OPERATOR_CREATION.INVITATION_SENT',
  // for FAILED_LOGIN_ATTEMPT
  attemptDateTime: 'FEED_ITEM.LOGIN_EVENTS.ATTEMPT_DATE_TIME',
  platformType: 'FEED_ITEM.ACCOUNTS.PLATFORM_TYPE',
  accountType: 'FEED_ITEM.ACCOUNTS.ACCOUNT_TYPE',
  accountUuid: 'FEED_ITEM.ACCOUNTS.ACCOUNT_UUID',
  paymentMethod: 'FEED_ITEM.ACCOUNTS.PAYMENT_METHOD',
  uuid: 'FEED_ITEM.ACCOUNTS.UUID',
  login: 'FEED_ITEM.ACCOUNTS.LOGIN',
  readOnly: 'FEED_ITEM.ACCOUNTS.READ_ONLY',
  archived: 'FEED_ITEM.ACCOUNTS.ARCHIVED',
  answer: 'CONSTANTS.AUDIT.RISK_PROFILE.ANSWER',
  agentId: 'FEED_ITEM.PAYMENTS.AGENT_ID',
  amount: 'FEED_ITEM.PAYMENTS.AMOUNT',
  verificationType: 'FEED_ITEM.KYC.TYPES.VERIFICATION_TYPE',
  documentType: 'FEED_ITEM.KYC.TYPES.DOCUMENT_TYPE',
  fileType: 'FEED_ITEM.KYC.TYPES.FILE_TYPE',
  pinned: 'COMMON.PINNED',
  subject: 'NOTES.SUBJECT',
  content: 'NOTES.CONTENT',
  lastUpdatedDate: 'FEED_ITEM.LAST_UPDATED_DATE',
  leverage: 'FEED_ITEM.LEVERAGE',
  initiatorName: 'FEED_ITEM.INITIATOR_NAME',
  initiatorUuid: 'FEED_ITEM.INITIATOR_UUID',
  templateName: 'FEED_ITEM.EMAIL.TEMPLATE_NAME',
};

const filterLabels = {
  searchValue: 'PROFILE.LIST.FILTERS.SEARCH',
  country: 'PROFILE.LIST.FILTERS.COUNTRY',
  city: 'PROFILE.LIST.FILTERS.CITY',
  age: 'PROFILE.LIST.FILTERS.AGE',
  ageFrom: 'PROFILE.LIST.FILTERS.AGE_FROM',
  ageTo: 'PROFILE.LIST.FILTERS.AGE_TO',
  currencies: 'PROFILE.LIST.FILTERS.CURRENCY',
  affiliateId: 'PROFILE.LIST.FILTERS.AFFILIATE_ID',
  status: 'PROFILE.LIST.FILTERS.STATUS',
  segments: 'PROFILE.LIST.FILTERS.SEGMENTS',
  registrationDate: 'PROFILE.LIST.FILTERS.REG_DATE_RANGE',
  registrationDateFrom: 'PROFILE.LIST.FILTERS.REG_DATE_FROM',
  registrationDateTo: 'PROFILE.LIST.FILTERS.REG_DATE_TO',
  firstDepositDateRange: 'PROFILE.LIST.FILTERS.FIRST_DEPOSIT_DATE',
  firstNoteDate: 'PROFILE.LIST.FILTERS.FIRST_NOTE_DATE',
  lastNoteDate: 'PROFILE.LIST.FILTERS.LAST_NOTE_DATE',
  lastTradeDate: 'PROFILE.LIST.FILTERS.LAST_TRADE_DATE',
  lastLoginDate: 'PROFILE.LIST.FILTERS.LAST_LOGIN_DATE',
  lastModificationDate: 'PROFILE.LIST.FILTERS.LAST_MODIFICATION_DATE',
  balance: 'PROFILE.LIST.FILTERS.BALANCE',
  balanceFrom: 'PROFILE.LIST.FILTERS.BALANCE_FROM',
  balanceTo: 'PROFILE.LIST.FILTERS.BALANCE_TO',
  acquisitionStatus: 'PROFILE.LIST.FILTERS.ACQUISITION_STATUS',
  desks: 'PROFILE.LIST.FILTERS.DESKS',
  teams: 'PROFILE.LIST.FILTERS.TEAMS',
  operators: 'SIDEBAR.TOP_MENU.OPERATORS',
  partners: 'PROFILE.LIST.FILTERS.AFFILIATES',
  offices: 'PROFILE.LIST.FILTERS.OFFICES',
  salesStatus: 'PROFILE.LIST.FILTERS.SALES_STATUS',
  accountStatus: 'PROFILE.LIST.FILTERS.ACCOUNT_STATUS',
  retentionStatus: 'PROFILE.LIST.FILTERS.RETENTION_STATUS',
  deskType: 'DESKS.GRID_FILTERS.DESK_TYPE_LABEL',
  office: 'DESKS.FILTERS.OFFICE',
  desk: 'DESKS.FILTERS.DESK',
  language: 'COMMON.LANGUAGE',
  languages: 'PROFILE.LIST.FILTERS.LANGUAGES',
  assignStatus: 'PROFILE.LIST.FILTERS.ASSIGN_STATUS',
  kycStatuses: 'PROFILE.LIST.FILTERS.KYC_STATUSES',
  firstDeposit: 'PROFILE.LIST.FILTERS.FIRST_DEPOSIT',
  searchLimit: 'COMMON.FILTERS.SEARCH_LIMIT',
  warning: 'PROFILE.LIST.FILTERS.WARNING',
  activity: 'PROFILE.LIST.FILTERS.ACTIVITY',
  referral: 'PROFILE.LIST.FILTERS.REFERRAL',
};

const statuses = keyMirror({
  NOT_VERIFIED: null,
  VERIFIED: null,
  BLOCKED: null,
});

const actions = keyMirror({
  BLOCK: null,
  UNBLOCK: null,
});

const reasons = {
  'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.USER_REQUEST':
    'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.USER_REQUEST',
  'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.BONUS_ABUSE':
    'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.BONUS_ABUSE',
  'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.DUPLICATE_ACCOUNT':
    'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.DUPLICATE_ACCOUNT',
  'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.PENDING_INVESTIGATION':
    'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.PENDING_INVESTIGATION',
  'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.OTHER':
    'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.OTHER',
};

const unblockReasons = {
  'PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.CUSTOMER_REQUEST':
    'PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.CUSTOMER_REQUEST',
  'PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.INVESTIGATION_COMPLETE':
    'PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.INVESTIGATION_COMPLETE',
  'PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.OTHER': 'PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.OTHER',
};

const statusesLabels = {
  [statuses.BLOCKED]: 'STATUSES_LABELS.BLOCKED',
  [statuses.NOT_VERIFIED]: 'STATUSES_LABELS.NOT_VERIFIED',
  [statuses.VERIFIED]: 'STATUSES_LABELS.VERIFIED',
};

const durationUnits = keyMirror({
  DAYS: null,
  WEEKS: null,
  MONTHS: null,
  YEARS: null,
  PERMANENT: null,
});

const statusActions = {
  [statuses.NOT_VERIFIED]: [
    {
      action: actions.BLOCK,
      label: 'ACTIONS_LABELS.BLOCK',
      reasons,
      permission: permissions.USER_PROFILE.STATUS,
    },
  ],
  [statuses.VERIFIED]: [
    {
      action: actions.BLOCK,
      label: 'ACTIONS_LABELS.BLOCK',
      reasons,
      permission: permissions.USER_PROFILE.STATUS,
    },
  ],
  [statuses.BLOCKED]: [
    {
      action: actions.UNBLOCK,
      label: 'ACTIONS_LABELS.UNBLOCK',
      reasons: unblockReasons,
      permission: permissions.USER_PROFILE.STATUS,
    },
  ],
};

const actionsLabels = {
  [actions.BLOCK]: 'ACTIONS_LABELS.BLOCK',
  [actions.UNBLOCK]: 'ACTIONS_LABELS.UNBLOCK',
};

const COUNTRY_SPECIFIC_IDENTIFIER_TYPES = [
  'TEN_DSS_DIGIT_INVESTOR_SHARE',
  'ELEVEN_DIGIT_PERSONAL_ID',
  'BELGIAN_NATIONAL_NUMBER',
  'BULGARIAN_PERSONAL_NUMBER',
  'CONCAT',
  'ESTONIAN_PERSONAL_IDENTIFICATION_CODE',
  'FISCAL_CODE',
  'NATIONAL_IDENTIFICATION_NUMBER',
  'NATIONAL_IDENTIFICATION_NUMBER_COD_NUMERIC_PERSONAL',
  'NATIONAL_IDENTIFICATION_NUMBER_PESEL',
  'NATIONAL_PASSPORT_NUMBER',
  'PERSONAL_CODE_ASMENS_KODAS',
  'PERSONAL_CODE_PERSONAS_KODS',
  'PERSONAL_IDENTIFICATION_NUMBER',
  'PERSONAL_IDENTITY_CODE',
  'PERSONAL_IDENTITY_CODE_TEN_DIGITS_ALPHANUMERICAL_DDMMYYXXXX',
  'PERSONAL_IDENTITY_CODE_KENNITALA_ICELAND',
  'PERSONAL_IDENTITY_NUMBER',
  'PERSONAL_NUMBER',
  'TAX_IDENTIFICATION_NUMBER',
  'TAX_NUMBER',
  'UK_NATIONAL_INSURANCE_NUMBER',
];

const genders = {
  FEMALE: 'COMMON.GENDERS.FEMALE',
  MALE: 'COMMON.GENDERS.MALE',
  UNDEFINED: 'COMMON.GENDERS.UNDEFINED',
};

const AGE_YEARS_CONSTRAINT = 18;

export {
  attributeLabels,
  statuses,
  statusesLabels,
  durationUnits,
  actions,
  statusActions,
  filterLabels,
  unblockReasons,
  reasons,
  actionsLabels,
  genders,
  AGE_YEARS_CONSTRAINT,
  COUNTRY_SPECIFIC_IDENTIFIER_TYPES,
};
