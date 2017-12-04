import keyMirror from 'keymirror';
import permissions from '../config/permissions';
import I18n from '../utils/fake-i18n';

const attributeLabels = {
  acceptedTermsUUID: 'Accepted terms Uuid',
  address: 'Address',
  addressKycMetaData: 'Address files',
  kycAddressStatus: 'Address status',
  affiliateId: 'Affiliate ID',
  birthDate: 'Birth date',
  btag: 'B-Tag',
  city: 'City',
  completed: 'Profile completion',
  confirmedEmail: 'Confirmed email',
  country: 'Country',
  email: 'E-mail',
  firstName: 'First name',
  gender: 'Gender',
  id: 'Profile ID',
  identifier: 'Passport ID',
  kycCompleted: 'KYC Completion',
  languageCode: 'Language',
  lastName: 'Last name',
  marketingMail: 'Marketing Mails',
  marketingNews: 'Marketing News',
  marketingSMS: 'Marketing SMS',
  personalKycMetaData: 'Personal files',
  kycPersonalStatus: 'Personal status',
  phoneNumber: 'Phone number',
  phoneNumberVerified: 'Phone number verification',
  postCode: 'Post code',
  profileStatus: 'Status',
  profileStatusComment: 'Status comment',
  profileStatusReason: 'Status reason',
  tags: 'Profile tags',
  registrationDate: 'Registration date',
  registrationIP: 'Registration IP',
  suspendEndDate: 'Suspend end date',
  title: 'Title',
  token: 'Token',
  tokenExpirationDate: 'Token expiration date',
  username: 'Username',
  playerUUID: 'ID',
};
const filterLabels = {
  searchValue: 'Search by',
  country: 'Country',
  city: 'City',
  age: 'Age',
  ageFrom: 'Age from',
  ageTo: 'Age to',
  currencies: 'Currency',
  affiliateId: 'Affiliate ID',
  status: 'Status',
  tags: 'Tags',
  segments: 'Segments',
  registrationDate: 'Registered',
  registrationDateFrom: 'Registered from',
  registrationDateTo: 'Registered to',
  balance: 'Balance',
  balanceFrom: 'Balance from',
  balanceTo: 'Balance to',
};
const statuses = keyMirror({
  INACTIVE: null,
  ACTIVE: null,
  BLOCKED: null,
  SUSPENDED: null,
  COOLOFF: null,
});
const actions = keyMirror({
  BLOCK: null,
  UNBLOCK: null,
  SUSPEND: null,
  REMOVE: null,
  PROLONG: null,
});
const reasons = {
  'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.USER_REQUEST':
    I18n.t('PLAYER_PROFILE.PROFILE.BLOCK_REASONS.USER_REQUEST'),
  'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.BONUS_ABUSE':
    I18n.t('PLAYER_PROFILE.PROFILE.BLOCK_REASONS.BONUS_ABUSE'),
  'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.DUPLICATE_ACCOUNT':
    I18n.t('PLAYER_PROFILE.PROFILE.BLOCK_REASONS.DUPLICATE_ACCOUNT'),
  'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.PENDING_INVESTIGATION':
    I18n.t('PLAYER_PROFILE.PROFILE.BLOCK_REASONS.PENDING_INVESTIGATION'),
  'PLAYER_PROFILE.PROFILE.BLOCK_REASONS.OTHER':
    I18n.t('PLAYER_PROFILE.PROFILE.BLOCK_REASONS.OTHER'),
};
const unblockReasons = {
  'PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.CUSTOMER_REQUEST':
    I18n.t('PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.CUSTOMER_REQUEST'),
  'PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.INVESTIGATION_COMPLETE':
    I18n.t('PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.INVESTIGATION_COMPLETE'),
  'PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.OTHER': I18n.t('PLAYER_PROFILE.PROFILE.UNBLOCK_REASONS.OTHER'),
};
const selfExclusionReasons = {
  'PLAYER_PROFILE.PROFILE.SELF_EXCLUSION_REASONS.USER_REQUEST':
    I18n.t('PLAYER_PROFILE.PROFILE.SELF_EXCLUSION_REASONS.USER_REQUEST'),
  'PLAYER_PROFILE.PROFILE.SELF_EXCLUSION_REASONS.OTHER':
    I18n.t('PLAYER_PROFILE.PROFILE.SELF_EXCLUSION_REASONS.OTHER'),
};
const statusesLabels = {
  [statuses.INACTIVE]: 'Inactive',
  [statuses.ACTIVE]: 'Active',
  [statuses.BLOCKED]: 'Blocked',
  [statuses.SUSPENDED]: 'Self Excluded',
  [statuses.COOLOFF]: 'Cool off',
};
const durationUnits = keyMirror({
  DAYS: null,
  WEEKS: null,
  MONTHS: null,
  YEARS: null,
  PERMANENT: null,
});
const statusActions = {
  [statuses.INACTIVE]: [
    {
      action: actions.BLOCK,
      label: 'Block',
      reasons,
      permission: permissions.USER_PROFILE.BLOCK,
    },
    {
      action: actions.SUSPEND,
      label: 'Self Exclusion',
      reasons: selfExclusionReasons,
      permission: permissions.USER_PROFILE.SUSPEND,
    },
  ],
  [statuses.ACTIVE]: [
    {
      action: actions.BLOCK,
      label: 'Block',
      reasons,
      permission: permissions.USER_PROFILE.BLOCK,
    },
    {
      action: actions.SUSPEND,
      label: 'Self Exclusion',
      reasons: selfExclusionReasons,
      permission: permissions.USER_PROFILE.SUSPEND,
    },
  ],
  [statuses.BLOCKED]: [
    {
      action: actions.UNBLOCK,
      label: 'Unblock',
      reasons: unblockReasons,
      permission: permissions.USER_PROFILE.UNBLOCK,
    },
  ],
  [statuses.SUSPENDED]: [
    {
      action: actions.PROLONG,
      label: 'Prolong',
      reasons,
      permission: permissions.USER_PROFILE.PROLONG,
    },
    {
      action: actions.REMOVE,
      label: 'Remove',
      reasons,
      permission: permissions.USER_PROFILE.REMOVE,
    },
  ],
  [statuses.COOLOFF]: [
    {
      action: actions.REMOVE,
      label: 'Resume',
      reasons,
      permission: permissions.USER_PROFILE.REMOVE,
    },
  ],
};
const statusColorNames = {
  [statuses.ACTIVE]: 'color-success',
  [statuses.INACTIVE]: 'color-warning',
  [statuses.BLOCKED]: 'color-danger',
  [statuses.SUSPENDED]: 'color-secondary',
  [statuses.COOLOFF]: 'color-info',
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
};
