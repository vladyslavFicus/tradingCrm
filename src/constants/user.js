import keyMirror from 'keymirror';
import permissions from '../config/permissions';

const attributeLabels = {
  acceptedTermsUUID: 'CONSTANTS.AUDIT.TYPES.ACCEPTED_TERMS_UUID',
  address: 'CONSTANTS.AUDIT.TYPES.ADDRESS',
  addressKycMetaData: 'CONSTANTS.AUDIT.TYPES.ADDRESS_KYC_METADATA',
  kycAddressStatus: 'CONSTANTS.AUDIT.TYPES.KYC_ADDRESS_STATUS',
  affiliateId: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_ID',
  birthDate: 'CONSTANTS.AUDIT.TYPES.BIRTH_DATE',
  btag: 'CONSTANTS.AUDIT.TYPES.BTAG',
  city: 'CONSTANTS.AUDIT.TYPES.CITY',
  completed: 'CONSTANTS.AUDIT.TYPES.COMPLETED',
  confirmedEmail: 'CONSTANTS.AUDIT.TYPES.CONFIRMED_EMAIL',
  country: 'CONSTANTS.AUDIT.TYPES.COUNTRY',
  email: 'CONSTANTS.AUDIT.TYPES.EMAIL',
  firstName: 'CONSTANTS.AUDIT.TYPES.FIRST_NAME',
  gender: 'CONSTANTS.AUDIT.TYPES.GENDER',
  id: 'CONSTANTS.AUDIT.TYPES.ID',
  identifier: 'CONSTANTS.AUDIT.TYPES.IDENTIFIER',
  kycCompleted: 'CONSTANTS.AUDIT.TYPES.KYC_COMPLETED',
  languageCode: 'CONSTANTS.AUDIT.TYPES.LANGUAGE_CODE',
  lastName: 'CONSTANTS.AUDIT.TYPES.LAST_NAME',
  marketingMail: 'CONSTANTS.AUDIT.TYPES.MARKETING_MAIL',
  marketingSMS: 'CONSTANTS.AUDIT.TYPES.MARKETING_SMS',
  personalKycMetaData: 'CONSTANTS.AUDIT.TYPES.PERSONAL_KYC_METADATA',
  kycPersonalStatus: 'CONSTANTS.AUDIT.TYPES.KYC_PERSONAL_STATUS',
  phoneNumber: 'CONSTANTS.AUDIT.TYPES.PHONE_NUMBER',
  phoneNumberVerified: 'CONSTANTS.AUDIT.TYPES.PHONE_NUMBER_VERIFIED',
  postCode: 'CONSTANTS.AUDIT.TYPES.POST_CODE',
  profileStatus: 'CONSTANTS.AUDIT.TYPES.PROFILE_STATUS',
  profileStatusComment: 'CONSTANTS.AUDIT.TYPES.PROFILE_STATUS_COMMENT',
  profileStatusReason: 'CONSTANTS.AUDIT.TYPES.PROFILE_STATUS_REASON',
  registrationDate: 'CONSTANTS.AUDIT.TYPES.REGISTRATION_DATE',
  registrationIP: 'CONSTANTS.AUDIT.TYPES.REGISTRATION_IP',
  suspendEndDate: 'CONSTANTS.AUDIT.TYPES.SUSPEND_END_DATE',
  title: 'CONSTANTS.AUDIT.TYPES.TITLE',
  token: 'CONSTANTS.AUDIT.TYPES.TOKEN',
  tokenExpirationDate: 'CONSTANTS.AUDIT.TYPES.TOKEN_EXPIRATION_DATE',
  username: 'CONSTANTS.AUDIT.TYPES.USERNAME',
  playerUUID: 'CONSTANTS.AUDIT.TYPES.PLAYER_UUID',
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
  offices: 'PROFILE.LIST.FILTERS.OFFICES',
  salesStatus: 'PROFILE.LIST.FILTERS.SALES_STATUS',
  accountStatus: 'PROFILE.LIST.FILTERS.ACCOUNT_STATUS',
  retentionStatus: 'PROFILE.LIST.FILTERS.RETENTION_STATUS',
  deskType: 'DESKS.GRID_FILTERS.DESK_TYPE_LABEL',
  defaultDesk: 'DESKS.FILTERS.DEFAULT_DESK',
  office: 'DESKS.FILTERS.OFFICE',
  desk: 'DESKS.FILTERS.DESK',
  language: 'COMMON.LANGUAGE',
  assignStatus: 'PROFILE.LIST.FILTERS.ASSIGN_STATUS',
  kycStatus: 'PROFILE.LIST.FILTERS.KYC_STATUS',
  firstDeposit: 'PROFILE.LIST.FILTERS.FIRST_DEPOSIT',
  searchLimit: 'COMMON.FILTERS.SEARCH_LIMIT',
};

const statuses = keyMirror({
  INACTIVE: null,
  ACTIVE: null,
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
  [statuses.INACTIVE]: 'STATUSES_LABELS.INACTIVE',
  [statuses.ACTIVE]: 'STATUSES_LABELS.ACTIVE',
  [statuses.BLOCKED]: 'STATUSES_LABELS.BLOCKED',
};

const durationUnits = keyMirror({
  DAYS: null,
  WEEKS: null,
  MONTHS: null,
  YEARS: null,
  PERMANENT: null,
});

const statusActions = {
  [statuses.INACTIVE]: [],
  [statuses.ACTIVE]: [
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

const statusColorNames = {
  [statuses.ACTIVE]: 'color-success',
  [statuses.INACTIVE]: 'color-warning',
  [statuses.BLOCKED]: 'color-danger',
};

const actionsLabels = {
  [actions.BLOCK]: 'ACTIONS_LABELS.BLOCK',
  [actions.UNBLOCK]: 'ACTIONS_LABELS.UNBLOCK',
};

export {
  attributeLabels,
  statuses,
  statusesLabels,
  durationUnits,
  actions,
  statusActions,
  statusColorNames,
  filterLabels,
  unblockReasons,
  reasons,
  actionsLabels,
};
